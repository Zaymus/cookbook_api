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
					status: CRUD_STATUS.RETRIEVED,
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
					status: CRUD_STATUS.RETRIEVED,
					recipe,
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.patch("/recipe", (req, res, next) => {
	Recipe.updateOne({ id: req.body.id }, { ...req.body })
		.then((result) => {
			res.json({
				...req.json,
				isSuccessful: true,
				wasFound: true,
				wasUpdated: true,
				status: CRUD_STATUS.UPDATED,
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
					status: CRUD_STATUS.DELETED,
				});
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

module.exports = router;
