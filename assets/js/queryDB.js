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
	this.db.query('SELECT * FROM products WHERE stock_quantity > 0', function (err, res) {
		if(err) throw err;
		callback(res);
	});

};
//----------------------------------
QueryDB.prototype.getStock = function (id,callback) {
	this.db.query('SELECT * FROM products WHERE  ?',{item_id: id},  function (err, res) {
		if (err) throw err;
		callback(res[0].stock_quantity);
	});

};
//----------------------------------
QueryDB.prototype.endConnection = function () {
	this.db.end();
};
//----------------------------------
QueryDB.prototype.postOrder = function (itemID, quant) {
	this.db.query('UPDATE products SET stock_quantity = stock_quantity - '+quant+' WHERE ? AND stock_quantity >= '+ quant, [{item_id: itemID}], function (err, res) {
		if (err) throw err;
		if(res.changedRows !== 0){
			console.log('Order Posted!');
		} else {
			console.log('Insuficient Stock!');
		}
	}.bind(this));
};
//----------------------------------


module.exports = QueryDB;


var mydb = new QueryDB();

