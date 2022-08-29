const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const middleware = require("./middleware");
const mongoose = require("mongoose");

dotenv.config();
const env = process.env;

const app = express();
const apiRouter = express.Router();

const serverRouter = require("./routes/server");
const recipeRouter = require("./routes/recipes");

apiRouter.use(serverRouter);
apiRouter.use(recipeRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(middleware);
app.use("/api", apiRouter);

mongoose
	.connect(env.MONGODB_URL)
	.then((result) => {
		app.listen(env.API_PORT);
	})
	.catch((err) => {
		console.log(err);
	});
