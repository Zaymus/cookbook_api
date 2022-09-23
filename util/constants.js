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
	FAT_CALORIES_GRAM: 9,
	CARB_CALORIES_GRAM: 4,
	PROTEIN_CALORIES_GRAM: 4,
};

const ACCEPTED_MEASUREMENTS = [
	"tsp",
	"tbsp",
	"cup",
	"ml",
	"l",
	"oz",
	"g",
	"mg",
	"kg",
];

const MEASURE_AMOUNTS = {
	EIGTH: "0.125",
	QUARTER: "0.25",
	HALF: "0.5",
	ONE: "1",
};

const WEIGHT_UNITS = {
	OUNCE: "oz",
	GRAM: "g",
	KILOGRAM: "kg",
	MILLIGRAM: "mg",
};

const FLUID_UNITS = {
	MILLILITRE: "ml",
	LITRE: "l",
	CUP: "cup",
	TEASPOON: "tsp",
	TABLESPOON: "tbsp",
};

const GRAMS_OUNCE_DIVISOR = 28.35;
const GRAMS_K_M_CONST = 1000;
const MILLILITRE_TEASPOON_CONST = 4.929;
const MILLILITRE_TABLESPOON_CONST = 14.787;
const MILLILITRE_CUP_CONST = 236.6;
const TEASPOON_TABLESPOON_CONST = 3;
const TEASPOON_CUP_CONST = 48;
const TABLESPOON_MILLILITRE_CONST = 14.787;
const TABLESPOON_CUP_CONST = 16;
const MILLILITRE_OUNCE_CONST = 29.574;
const TEASPOON_OUNCE_CONST = 6;
const TABLESPOON_OUNCE_CONST = 2;
const CUP_OUNCE_CONST = 8.115;

module.exports = {
	CRUD_STATUS,
	SERVER_STATUS,
	userValidation,
	recipeVisibility,
	nutritionix_config_dev,
	MACRO_CONSTANTS,
	ACCEPTED_MEASUREMENTS,
	WEIGHT_UNITS,
	FLUID_UNITS,
	MEASURE_AMOUNTS,
	GRAMS_OUNCE_DIVISOR,
	GRAMS_K_M_CONST,
	MILLILITRE_TEASPOON_CONST,
	MILLILITRE_TABLESPOON_CONST,
	MILLILITRE_CUP_CONST,
	TEASPOON_TABLESPOON_CONST,
	TEASPOON_CUP_CONST,
	TABLESPOON_MILLILITRE_CONST,
	TABLESPOON_CUP_CONST,
	MILLILITRE_OUNCE_CONST,
	TEASPOON_OUNCE_CONST,
	TABLESPOON_OUNCE_CONST,
	CUP_OUNCE_CONST,
};
