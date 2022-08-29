const express = require("express");
const router = express.Router();

router.get("/health", (req, res, next) => {
	res.json({ status: "up" });
});

module.exports = router;
