const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;

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

module.exports = router;
