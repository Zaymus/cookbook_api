const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	name: {
		prefix: {
			type: String,
		},
		firstName: {
			type: String,
			required: true,
		},
		middleName: {
			type: String,
		},
		lastName: {
			type: String,
			required: true,
		},
		suffix: {
			type: String,
		},
	},
	password: {
		type: String,
		required: true,
	},
	recipes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Recipe",
		},
	],
});

module.exports = mongoose.model("User", userSchema);
