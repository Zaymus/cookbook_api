const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipe");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { userValidation } = require("../util/constants");
const { default: mongoose } = require("mongoose");

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
		res.json({ isDataVerified: isValid, err: errors });
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
											res.json({ ...req.json, err });
										});
								} else {
									res.json({ ...req.json, err: "Email already in use" });
								}
							})
							.catch((err) => {
								res.json({ ...req.json, err });
							});
					} else {
						res.json({ ...req.json, err: "Invalid data" });
					}
				})
				.catch((err) => {
					res.json({ ...req.json, err });
				});
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.get("/user", (req, res, next) => {
	const email = req.body.email;

	User.findOne({ email: email })
		.then((user) => {
			if (user == null) {
				res.json({ ...req.json, err: "User not found" });
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
			res.json(...req.json, err);
		});
});

router.get("/user/:userId", (req, res, next) => {
	User.findById(req.params.userId)
		.then((user) => {
			if (user == null) {
				res.json({ ...req.json });
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
			res.json(...req.json, err);
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
								User.updateOne(
									{ id: id },
									{ ...req.body, password: hashedPassword }
								)
									.then((result) => {
										res.json({
											...req.json,
											isSuccessful: true,
											wasFound: true,
											wasUpdated: true,
											status: CRUD_STATUS.UPDATED,
										});
									})
									.catch((err) => res.json({ ...req.json, err }));
							});
						} else {
							res.json({
								...req.json,
								wasFound: true,
								err: "Email already in use",
							});
						}
					})
					.catch((err) => {
						res.json({ ...req.json, err });
					});
			} else {
				res.json({ ...req.json, err: result.data.err });
			}
		})
		.catch((err) => {
			res.json({ err: err });
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
					res.json({ ...req.json, err });
				});
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

router.get("/user/recipes/:userId", (req, res, next) => {
	const id = req.params.userId;
	User.findById(id)
		.then((user) => {
			if (user == null) {
				res.json({ ...req.json });
			} else {
				let recipeIds = user.recipes;
				if (user.recipes.length > 0) {
					let recipes = [];
					recipeIds.forEach((r) => {
						Recipe.findById(r.toString())
							.then((recipe) => {
								recipes.push(recipe);
							})
							.catch((err) => {
								console.log(
									`Could not find recipe with an id of ${r.toString()}`
								);
							});
					});

					res.json({
						...req.json,
						isSuccessful: recipes.length > 0,
						wasFound: isSuccessful,
						status: isSuccessful ? CRUD_STATUS.RETRIEVED : CRUD_STATUS.ERROR,
					});
				}
			}
		})
		.catch((err) => {
			res.json({ ...req.json, err });
		});
});

module.exports = router;
