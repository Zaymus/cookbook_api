const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcryptjs");

router.post("/user/validate", (req, res, next) => {
	const { email, name, password } = req.body;

	let isValid =
		User.verifyEmailFormat(email) &&
		User.verifyName(name) &&
		User.verifyPassword(password);

	res.json({ dataVerified: isValid });
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
					if (result.data.dataVerified) {
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
								}
								console.log(user);
								res.json({ ...req.json, err: "Email already in use" });
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

router.patch("/user", (req, res, next) => {});

router.put("/user", (req, res, next) => {});

module.exports = router;
