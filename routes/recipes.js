const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const { CRUD_STATUS, nutritionix_config_dev } = require("../util/constants");
const DOTENV = require("dotenv");
const axios = require("axios");
const {
	convertServingSizeUnit,
	calculateMacroData,
} = require("../util/functions");

router.post("/recipe", (req, res, next) => {
	const recipe = new Recipe({ ...req.body });
	recipe
		.save()
		.then((result) => {
			res.json({
				...req.json,
				isSuccessful: true,
				status: CRUD_STATUS.SAVED,
			});
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/recipe/healthInfo", (req, res, next) => {
	const recipeId = req.query.recipeId;
	const devmode = req.query.devmode;
	axios
		.get(`${process.env.BASE_URL}/recipe/${recipeId}`)
		.then((result) => {
			const response = result.data;
			if (
				response.isSuccessful &&
				response.wasFound &&
				response.status === CRUD_STATUS.RETRIEVED
			) {
				const ingredients = response.recipe.ingredients;
				const numServings = response.recipe.numServings;
				var macros = {
					calories: 0,
					carbs: 0,
					fat: 0,
					protein: 0,
				};
				let itemCount = 0;
				ingredients.forEach((item) => {
					const foodItem = JSON.stringify(item);

					axios
						.get(
							`${process.env.BASE_URL}/macros?foodItem=${foodItem}${
								devmode === "true" ? `&devmode=true` : ""
							}`
						)
						.then((result) => {
							itemCount++;
							return result.data;
						})
						.then((macroData) => {
							if (
								macroData.isSuccessful &&
								macroData.wasFound &&
								macroData.status === CRUD_STATUS.RETRIEVED
							) {
								macros.calories += macroData.calories;
								macros.carbs += macroData.carbs.total;
								macros.fat += macroData.fat.total;
								macros.protein += macroData.protein.total;
								if (itemCount == ingredients.length) {
									return true;
								}
								return false;
							}
						})
						.then((totalComplete) => {
							if (totalComplete) {
								const macroData = calculateMacroData(
									macros.fat / numServings,
									macros.carbs / numServings,
									macros.protein / numServings
								);

								macroData.calories =
									Math.round(
										(macros.calories / numServings + Number.EPSILON) * 100
									) / 100;

								res.json({
									...req.json,
									isSuccessful: true,
									wasFound: true,
									status: CRUD_STATUS.RETRIEVED,
									macroData,
								});
							}
						})
						.catch((err) => {
							res.json({ ...req.json, err });
						});
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.get("/recipe/:recipeId", (req, res, next) => {
	const id = req.params.recipeId;
	Recipe.findById(id)
		.then((recipe) => {
			if (recipe == null) {
				res.status(400).json({ ...req.json });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					recipe,
				});
			}
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/recipe", (req, res, next) => {
	const name = req.query.name;
	Recipe.find({ name: name })
		.then((recipe) => {
			if (!recipe.length) {
				res.status(400).json({ ...req.json });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					recipe,
				});
			}
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.patch("/recipe", (req, res, next) => {
	const id = req.body.id;
	delete req.body.id;
	Recipe.findById(id)
		.then((recipe) => {
			recipe
				.updateOne({ $set: { ...req.body } })
				.then((result) => {
					if (result.modifiedCount) {
						Recipe.findById(id).then((recipe) => {
							res.json({
								...req.json,
								isSuccessful: true,
								wasFound: true,
								wasUpdated: true,
								status: CRUD_STATUS.UPDATED,
							});
						});
					} else {
						res.json({ ...req.json });
					}
				})
				.catch((err) => {
					res.status(400).json({ ...req.json, err });
				});
		})
		.catch((err) => console.log(err));
});

router.put("/recipe", (req, res, next) => {
	const id = req.query.id;
	Recipe.deleteOne({ _id: id })
		.then((result) => {
			if (result.deletedCount == 0) {
				res.json({
					...req.json,
					isSuccessful: true,
					status: "No record to delete",
				});
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					wasDeleted: true,
					status: CRUD_STATUS.DELETED,
				});
			}
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/macros", (req, res, next) => {
	const foodItem = JSON.parse(req.query.foodItem);
	if (req.query.devmode == "true") {
		axios
			.post(
				process.env.NUTRITIONIX_NUTRITION_INFO,
				{ query: foodItem.ingredient },
				nutritionix_config_dev
			)
			.then((result) => {
				const foodData = result.data.foods[0];

				const servingSizeWeight = convertServingSizeUnit(foodItem, foodData);
				const servingSizeScale = foodItem.amount / servingSizeWeight;
				const calories = Math.round(foodData.nf_calories * servingSizeScale);
				const totalFat = Math.round(foodData.nf_total_fat * servingSizeScale);
				const totalCarbs = Math.round(
					foodData.nf_total_carbohydrate * servingSizeScale
				);
				const totalProtein = Math.round(foodData.nf_protein * servingSizeScale);

				const macroData = calculateMacroData(
					totalFat,
					totalCarbs,
					totalProtein
				);

				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					calories: calories,
					...macroData,
				});
			})
			.catch((err) => {
				res.status(400).json({ ...req.json, status: "API Error", err });
			});
	}
});

module.exports = router;
