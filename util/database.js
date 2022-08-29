const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	mongoClient
		.connect(
			"mongodb+srv://Carson:nodecomplete@cluster0.pnmyf.mongodb.net/cookbook?retryWrites=true&w=majority"
		)
		.then((client) => {
			console.log("Connected!");
			_db = client.db();
			callback(client);
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw "No Database Found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
