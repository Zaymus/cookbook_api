const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");

const app = express();
const apiRouter = express.Router();

const serverRouter = require("./routes/server");
const recipeRouter = require("./routes/recipes");

apiRouter.use(serverRouter);
apiRouter.use(recipeRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", apiRouter);

mongoose
	.connect(
		"mongodb+srv://Carson:nodecomplete@cluster0.pnmyf.mongodb.net/cookbook?retryWrites=true"
	)
	.then((result) => {
		app.listen(9001);
	})
	.catch((err) => {
		console.log(err);
	});
