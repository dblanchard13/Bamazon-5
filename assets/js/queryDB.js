var QueryDB = function () {
	this.mysql = require('mysql');

	this.db = this.mysql.createConnection({
		host: 'localHost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'bamazonDB'
	});

};
//----------------------------------
QueryDB.prototype.getAll = function (callback) {
	this.db.query('SELECT * FROM products', function (err, res) {
		if(err) throw err;
		callback(res);
	});

};
//----------------------------------
QueryDB.prototype.getStock = function (id,callback) {
	this.db.query('SELECT * FROM products WHERE  ?',{item_id: id},  function (err, res) {
		if (err) throw err;
		callback(res);
	});

};
//----------------------------------
QueryDB.prototype.endConnection = function () {
	this.db.end();
};

module.exports = QueryDB;


