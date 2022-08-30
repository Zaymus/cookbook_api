const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CRUD_STATUS = require("../util/constants").CRUD_STATUS;

router.post("/user", (req, res, next) => {});

router.get("/user", (req, res, next) => {});

router.get("/user/:userId", (req, res, next) => {});

router.patch("/user", (req, res, next) => {});

router.put("/user", (req, res, next) => {});
