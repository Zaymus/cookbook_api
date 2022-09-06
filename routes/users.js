const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipe");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;
const recipeVisibility = require("../util/constants").recipeVisibility;
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcryptjs");

router.post("/user/validate", (req, res, next) => {
	const { email, name, password } = req.body;
	let isEmailValid = User.verifyEmailFormat(email);
	let isNameValid = User.verifyName(name);
	let isPasswordValid = User.verifyPassword(password);

	let isValid = isEmailValid && isNameValid && isPasswordValid;
	if (isValid) {
		res.json({ isDataVerified: isValid });
	} else {
		let errors = [];
		if (!isEmailValid) errors.push("Email is invalid");
		if (!isNameValid) errors.push("Name is invalid");
		if (!isPasswordValid) errors.push("Password is invalid");
		res.status(400).json({ isDataVerified: isValid, err: errors });
	}
});

router.post("/user", (req, res, next) => {
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;

	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			axios
				.post(`${process.env.BASE_URL}/user/validate`, req.body)
				.then((result) => {
					if (result.data.isDataVerified) {
						User.findOne({ email: email })
							.then((user) => {
								if (user == null) {
									const user = new User({
										email: email,
										name: name,
										password: hashedPassword,
									});

									user
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
								} else {
									res
										.status(400)
										.json({ ...req.json, err: "Email already in use" });
								}
							})
							.catch((err) => {
								res.status(400).json({ ...req.json, err });
							});
					} else {
						res.status(400).json({ ...req.json, err: "Invalid data" });
					}
				})
				.catch((err) => {
					res.status(400).json({ ...req.json, err });
				});
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/user", (req, res, next) => {
	const email = req.query.email;

	User.findOne({ email: email })
		.then((user) => {
			if (user == null) {
				res.status(400).json({ ...req.json, err: "User not found" });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					user: user,
				});
			}
		})
		.catch((err) => {
			res.status(400).json(...req.json, err);
		});
});

router.get("/user/:userId", (req, res, next) => {
	User.findById(req.params.userId)
		.then((user) => {
			if (user == null) {
				res.status(400).json({ ...req.json });
			} else {
				res.json({
					...req.json,
					isSuccessful: true,
					wasFound: true,
					status: CRUD_STATUS.RETRIEVED,
					user: user,
				});
			}
		})
		.catch((err) => {
			res.status(400).json(...req.json, err);
		});
});

router.patch("/user", (req, res, next) => {
	const id = req.body.id;
	var isVerified = false;
	axios
		.post(`${process.env.BASE_URL}/user/validate`, req.body)
		.then((result) => {
			isVerified = result.data.isDataVerified;
			if (isVerified) {
				User.findOne({ email: req.body.email })
					.then((user) => {
						if (user == null || user._id.toString() === req.body.id) {
							bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
								user
									.updateOne({ ...req.body, password: hashedPassword })
									.then((result) => {
										res.json({
											...req.json,
											isSuccessful: true,
											wasFound: true,
											wasUpdated: true,
											status: CRUD_STATUS.UPDATED,
										});
									})
									.catch((err) => res.status(400).json({ ...req.json, err }));
							});
						} else {
							res.status(400).json({
								...req.json,
								wasFound: true,
								err: "Email already in use",
							});
						}
					})
					.catch((err) => {
						res.status(400).json({ ...req.json, err });
					});
			} else {
				res.status(400).json({ ...req.json, err: result.data.err });
			}
		})
		.catch((err) => {
			res.status(400).json({ err: err });
		});
});

router.put("/user", (req, res, next) => {
	const id = req.body.id;
	User.findById(id)
		.then((user) => {
			User.deleteOne({ _id: id })
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
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/user/:userId/recipes", (req, res, next) => {
	const id = req.params.userId;
	User.findById(id)
		.then((user) => {
			if (user == null) {
				res.status(400).json({ ...req.json });
			} else {
				Recipe.find({
					_id: { $in: user.recipes },
				})
					.then((recipes) => {
						if (recipes.length > 0) {
							var userRecipes = recipes.filter((recipe) => {
								recipe.visibility === recipeVisibility.PUBLIC;
								return recipe;
							});
							res.json({
								...req.json,
								isSuccessful: true,
								wasFound: true,
								status: CRUD_STATUS.RETRIEVED,
								recipes: userRecipes,
							});
						} else {
							res.status(400).json({ ...req.json });
						}
					})
					.catch((err) => {
						res.status(400).json({ ...req.json, err });
					});
			}
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.get("/user/:userId/myCookbook", (req, res, next) => {
	const userId = req.params.userId;
	axios
		.get(`${process.env.BASE_URL}/user/${userId}/recipes`)
		.then((response) => {
			var userRecipes = response.data.recipes;
			Recipe.find({ users: userId })
				.then((sharedRecipes) => {
					sharedRecipes.forEach((recipe) => {
						if (recipe.visibility != recipeVisibility.PRIVATE) {
							userRecipes.push(recipe);
						}
					});
					res.json({
						...req.json,
						isSuccessful: true,
						wasFound: true,
						status: CRUD_STATUS.RETRIEVED,
						recipes: userRecipes,
					});
				})
				.catch((err) => {
					res.status(400).json({ ...req.json, err });
				});
		})
		.catch((err) => {
			res.status(400).json({ ...req.json, err });
		});
});

router.post("/user/addRecipe", (req, res, next) => {
	const userId = req.query.userId;
	const recipeId = req.query.recipeId;
	User.findByIdAndUpdate(userId, { $push: { recipes: recipeId } })
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

router.post("/user/removeRecipe", (req, res, next) => {
	const userId = req.query.userId;
	const recipeId = req.query.recipeId;
	User.findById(userId)
		.then((user) => {
			user
				.update({ $pop: { recipes: user.recipes.indexOf(recipeId) } })
				.then((result) => {
					res.json({
						...req.json,
						isSuccessful: true,
						wasFound: true,
						wasDeleted: true,
						status: CRUD_STATUS.UPDATED,
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

module.exports = router;
