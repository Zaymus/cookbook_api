const express = require("express");
const recipe = require("../models/recipe");
const router = express.Router();
const Recipe = require("../models/recipe");

router.post("/recipe", (req, res, next) => {
	console.log(req.body);
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
			res.json({ status: "Saved" });
		})
		.catch((err) => {
			console.log(err);
			res.json({ status: "error" });
		});
});

router.get("/recipe/:recipeId", (req, res, next) => {
	const id = req.params.recipeId;
	console.log("id");
	Recipe.findById(id)
		.then((recipe) => {
			res.json(200, recipe);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/recipe", (req, res, next) => {
	const name = req.body.name;
	Recipe.find({ name: name })
		.then((recipe) => {
			res.json(recipe);
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
