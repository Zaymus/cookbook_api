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

exports.CRUD_STATUS = CRUD_STATUS;
exports.SERVER_STATUS = SERVER_STATUS;
exports.userValidation = userValidation;
