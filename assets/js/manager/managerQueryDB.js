var QueryDB = function () {
	if(!(this instanceof QueryDB)){
		return new QueryDB();
	}
	this.mysql = require('mysql');

	this.db = this.mysql.createConnection({
		host: 'localHost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'bamazonDB'
	});
};
//---------------------------------
QueryDB.prototype.connectionCheck = function () {
	this.db.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + this.db.threadId);
	}.bind(this));
	this.db.end();
};
//---------------------------------
QueryDB.prototype.getAll = function (callback) {
	this.db.query('SELECT * FROM products', function (err, res) {
		if(err) throw err;
		callback(res);
	});
};
//---------------------------------
QueryDB.prototype.lowInvetory = function (low, callback) {
	this.db.query('SELECT * FROM products WHERE stock_quantity < ' + low, function (err, res) {
		if (err) throw err;
		callback(res);
	});
};
//---------------------------------
QueryDB.prototype.addInventory = function (item,quantity) {
	this.db.query('UPDATE products SET stock_quantity = stock_quantity + '+quantity+' WHERE item_id ='+item, function (err) {
		if (err) throw err;
	});
};
//---------------------------------
QueryDB.prototype.addProduct = function (prodObj) {
	this.db.query('INSERT INTO products SET ?',prodObj , function (err) {
		if (err) throw err;
	});
};
//---------------------------------






module.exports = QueryDB;



/*var mydb =  QueryDB();*/


/*
mydb.addProduct({
	product_name: 'charger',
	department_name:'cell phone',
	price:45.30,
	stock_quantity:5},function (res) {
	console.log(res);
});*/


/*mydb.addInventory(4,10);*/

/*mydb.lowInvetory(1, function (res) {
	console.log(res);
});

mydb.getAll(function (res) {
	console.log(res);
});*/

//mydb.connectionCheck();