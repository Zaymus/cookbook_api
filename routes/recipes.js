const express = require("express");
const recipe = require("../models/recipe");
const router = express.Router();
const Recipe = require("../models/recipe");

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
			console.log("Saved Recipe!");
			res.json({ ...req.json, status: "Saved" });
		})
		.catch((err) => {
			console.log(err);
			res.json({ ...req.json, isSuccessful: false, err });
		});
});

router.get("/recipe/:recipeId", (req, res, next) => {
	const id = req.params.recipeId;
	Recipe.findById(id)
		.then((recipe) => {
			if (recipe == null) res.json({ ...req.json, isSuccessful: false });
			res.json({ ...req.json, wasFound: true, recipe });
		})
		.catch((err) => {
			console.log(err);
			res.json({ ...req.json, isSuccessful: false, err });
		});
});

router.get("/recipe", (req, res, next) => {
	const name = req.body.name;
	Recipe.find({ name: name })
		.then((recipe) => {
			if (!recipe.length) res.json({ ...req.json, isSuccessful: false });
			res.json({ ...req.json, wasFound: true, recipe });
		})
		.catch((err) => {
			console.log(err);
			res.json({ ...req.json, isSuccessful: false, err });
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
					console.log("Updated Recipe!");
					res.json({ ...req.json, wasFound: true, wasUpdated: true });
				})
				.catch((err) => {
					console.log(err);
					res.json({ ...req.json, isSuccessful: false, err });
				});
		})
		.catch((err) => {
			console.log(err);
			res.json({ ...req.json, isSuccessful: false, err });
		});
});

router.put("/recipe", (req, res, next) => {
	const id = req.body.id;
	Recipe.deleteOne({ _id: id })
		.then((result) => {
			res.json({ ...req.json, wasFound: true, wasDeleted: true });
		})
		.catch((err) => {
			console.log(err);
			res.json({ ...req.json, isSuccessful: false, err });
		});
});

module.exports = router;
