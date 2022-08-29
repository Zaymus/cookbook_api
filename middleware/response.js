const response = (req, res, next) => {
	const json = {
		isSuccessful: true,
		wasFound: false,
		wasUpdated: false,
		wasDeleted: false,
	};
	req.json = json;
	console.log(req.json);
	next();
};

module.exports = response;
