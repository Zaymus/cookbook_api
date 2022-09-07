const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;
const DOTENV = require("dotenv");
const nutritionix_config_dev =
	require("../util/constants").nutritionix_config_dev;
const axios = require("axios");
const MACRO_CONSTANTS = require("../util/constants").MACRO_CONSTANTS;

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
	if (req.query.devmode == "true") {
		axios
			.post(
				process.env.NUTRITIONIX_NUTRITION_INFO,
				{ query: req.query.foodItem },
				nutritionix_config_dev
			)
			.then((result) => {
				const FOOD_DATA = result.data.foods[0];

				const TOTAL_FAT = Math.round(FOOD_DATA.nf_total_fat);
				const TOTAL_CARBS = Math.round(FOOD_DATA.nf_total_carbohydrate);
				const TOTAL_PROTEIN = Math.round(FOOD_DATA.nf_protein);

				const FAT_CALS = TOTAL_FAT * MACRO_CONSTANTS.FAT_CALORIES_GRAM;
				const CARB_CALS = TOTAL_CARBS * MACRO_CONSTANTS.CARB_CALORIES_GRAM;
				const PROTEIN_CALS =
					TOTAL_PROTEIN * MACRO_CONSTANTS.PROTEIN_CALORIES_GRAM;
				const TOTAL_CALS = FAT_CALS + CARB_CALS + PROTEIN_CALS;

				const fat = (FAT_CALS / TOTAL_CALS) * 100;
				const carbs = (CARB_CALS / TOTAL_CALS) * 100;
				const protein = (PROTEIN_CALS / TOTAL_CALS) * 100;

				const fat_perc = Math.round((fat + Number.EPSILON) * 100) / 100;
				const carbs_perc = Math.round((carbs + Number.EPSILON) * 100) / 100;
				const protein_perc = Math.round((protein + Number.EPSILON) * 100) / 100;

				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					carbs: carbs_perc,
					fat: fat_perc,
					protein: protein_perc,
				});
			})
			.catch((err) => {
				res.status(400).json({ ...req.json, status: "API Error", err });
			});
	}
});

module.exports = router;
