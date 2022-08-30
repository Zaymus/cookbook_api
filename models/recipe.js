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
	ingredients: [
		{
			ingredient: {
				type: String,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
			unit: {
				type: String,
				required: true,
			},
		},
	],
	steps: [
		{
			type: String,
			required: true,
		},
	],
	imageUrl: {
		type: String,
		required: true,
	},
	tags: [
		{
			type: String,
		},
	],
	healthInfo: {
		calories: {
			type: Number,
		},
		macros: {
			protien: {
				type: Number,
			},
			carbs: {
				type: Number,
			},
			fat: {
				type: Number,
			},
		},
		calorieType: {
			type: String,
		},
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	visibility: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Recipe", recipeSchema);
