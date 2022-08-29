const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	numServings: {
		type: Number,
		required: true,
	},
	steps: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Recipe", recipeSchema);
