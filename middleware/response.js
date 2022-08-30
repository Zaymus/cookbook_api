const CRUD_STATUS = require("../util/constants").CRUD_STATUS;
const response = (req, res, next) => {
	const json = {
		isSuccessful: false,
		wasFound: false,
		wasUpdated: false,
		wasDeleted: false,
		status: CRUD_STATUS.ERROR,
	};
	req.json = json;
	next();
};

module.exports = response;
