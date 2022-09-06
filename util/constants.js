const dotenv = require("dotenv").config();

CRUD_STATUS = {
	SAVED: "Saved",
	RETRIEVED: "Retrieved",
	UPDATED: "Updated",
	DELETED: "Deleted",
	ERROR: "CRUD Error",
};

SERVER_STATUS = {
	UP: "up",
};

const userValidation = {
	EMAIL_FORMAT: new RegExp(/^([A-Za-z0-9])+@([A-Za-z0-9])+..([A-Za-z]{2,4})$/),
	USER_PREFIX_LIST: ["Mr.", "Ms.", "Mrs.", "Miss.", "Dr."],
	USER_SUFFIX_LIST: ["II", "III", "IV", "V", "Esq.", "Sr.", "Jr."],
	NAME_FORMAT: /^[a-zA-Z]{2,40}$/,
	PASSWORD_FORMAT:
		/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
};

const recipeVisibility = {
	PUBLIC: "Public",
	SHARED: "Shared",
	PRIVATE: "Private",
};

const nutritionix_config_dev = {
	headers: {
		"x-app-id": process.env.NUTRITIONIX_APP_ID,
		"x-app-key": process.env.NUTRITIONIX_API_KEY,
		"x-remote-user-id": process.env.NUTRITIONIX_USER_ID_DEV,
	},
};

const MACRO_CONSTANTS = {
	FAT_CALORIES_GRAM: 9.54,
	CARB_CALORIES_GRAM: 4,
	PROTEIN_CALORIES_GRAM: 4.25,
};

exports.CRUD_STATUS = CRUD_STATUS;
exports.SERVER_STATUS = SERVER_STATUS;
exports.userValidation = userValidation;
exports.recipeVisibility = recipeVisibility;
exports.nutritionix_config_dev = nutritionix_config_dev;
exports.MACRO_CONSTANTS = MACRO_CONSTANTS;
