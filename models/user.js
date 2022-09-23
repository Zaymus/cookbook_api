const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { userValidation } = require("../util/constants");

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

userSchema.methods.verifyData = (userData) => {
	verifyEmail();
	verifyName();
	verifyPassword();
};

userSchema.statics.verifyEmailFormat = (email) => {
	return userValidation.EMAIL_FORMAT.test(email);
};

userSchema.statics.verifyName = (name) => {
	const { prefix, firstName, middleName, lastName, suffix } = name;
	isValidName =
		userValidation.NAME_FORMAT.test(firstName) &&
		userValidation.NAME_FORMAT.test(lastName);
	if (middleName.length > 0 && isValidName)
		isValidName = userValidation.NAME_FORMAT.test(middleName);

	if (prefix?.length > 0) {
		var prefixList = userValidation.USER_PREFIX_LIST.filter((p) => {
			if (p === prefix) return p;
		});
		if (prefixList.length == 0) {
			// invalid prefix
			isValidName = false;
		}
	}

	if (suffix?.length > 0) {
		var suffixList = userValidation.USER_SUFFIX_LIST.filter((s) => {
			if (s === suffix) return s;
		});
		if (suffixList.length == 0) {
			// invalid suffix
			isValidName = false;
		}
	}

	return isValidName;
};

userSchema.statics.verifyPassword = (password) => {
	return userValidation.PASSWORD_FORMAT.test(password);
};

module.exports = mongoose.model("User", userSchema);
