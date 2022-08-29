const RECIPE_STATUS = require("../util/constants").RECIPE_STATUS;
const response = (req, res, next) => {
	const json = {
		isSuccessful: false,
		wasFound: false,
		wasUpdated: false,
		wasDeleted: false,
		status: RECIPE_STATUS.ERROR,
	};
	req.json = json;
	next();
};

module.exports = response;
