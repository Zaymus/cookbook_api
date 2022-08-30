const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const RECIPE_STATUS = require("../util/constants").RECIPE_STATUS;

router.post("/recipe", (req, res, next) => {
	const name = req.body.name;
	const numServings = req.body.numServings;
	const steps = req.body.steps;
	const imageUrl = req.body.imageUrl;

	const recipe = new Recipe({
		name: name,
		numServings: numServings,
		steps: steps,
		imageUrl: imageUrl,
	});
	recipe
		.save()
		.then((result) => {
			res.json({
				...req.json,
				isSuccessful: true,
				status: RECIPE_STATUS.SAVED,
			});
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
				res.json({ ...req.json });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: RECIPE_STATUS.RETRIEVED,
					recipe,
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.get("/recipe", (req, res, next) => {
	const name = req.body.name;
	Recipe.find({ name: name })
		.then((recipe) => {
			if (!recipe.length) {
				res.json({ ...req.json });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: RECIPE_STATUS.RETRIEVED,
					recipe,
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.patch("/recipe", (req, res, next) => {
	const id = req.body.id;
	const name = req.body.name;
	const numServings = req.body.numServings;
	const steps = req.body.steps;
	const imageUrl = req.body.imageUrl;
	Recipe.findById(id)
		.then((recipe) => {
			recipe.name = name;
			recipe.numServings = numServings;
			recipe.steps = steps;
			recipe.imageUrl = imageUrl;
			recipe
				.save()
				.then((result) => {
					res.json({
						...req.json,
						isSuccessful: true,
						wasFound: true,
						wasUpdated: true,
						status: RECIPE_STATUS.UPDATED,
					});
				})
				.catch((err) => {
					res.json({ ...req.json, err });
				});
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.put("/recipe", (req, res, next) => {
	const id = req.body.id;
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
					status: RECIPE_STATUS.DELETED,
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

module.exports = router;
