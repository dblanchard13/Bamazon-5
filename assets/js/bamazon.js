var  Bamazon = function(){
	if(!(this instanceof Bamazon)){
		return new Bamazon();
	}
	this.Table = require('cli-table');
	this.mysql = require('mysql');

	this.db = this.mysql.createConnection({
		host: 'localHost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'bamazonDB'
	});
};

// Customer View
Bamazon.prototype.connectionCheck = function () {
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
Bamazon.prototype.clearScreen = function () {
	console.log('\033c');
};
//---------------------------------
Bamazon.prototype.endConnection = function () {
	this.db.end();
};
//---------------------------------
Bamazon.prototype.tableDisplay = function (dataObj,callback) {
	var table = new this.Table({
		head: dataObj.head
	});

	dataObj.body.forEach(function (thisProduct) {
		var row = [];

		if(thisProduct.purchase){
			row = [thisProduct.item_id, thisProduct.product_name, thisProduct.stock_quantity, thisProduct.price, thisProduct.purchase];
			table.push(row);
		} else {
			row = [thisProduct.item_id, thisProduct.product_name, thisProduct.price, thisProduct.stock_quantity];
			table.push(row);
		}
	});

	if (typeof callback === 'function') {
		callback();
	}
	console.log(table.toString());
};
//---------------------------------
Bamazon.prototype.getAll = function (callback) {
	this.db.query('SELECT * FROM products WHERE stock_quantity > 0', function (err, res) {
		if(err) throw err;
		callback(res);
	});
};
//---------------------------------
Bamazon.prototype.postOrder = function (itemID, quant) {
	this.db.query('UPDATE products SET stock_quantity = stock_quantity - '+quant+' WHERE ? AND stock_quantity >= '+ quant, [{item_id: itemID}], function (err, res) {
		if (err) throw err;
		if(res.changedRows !== 0){
			console.log('\nOrder Posted!\n');
		} else {
			console.log('\nInsuficient Stock!\n');
		}
	}.bind(this));
};
//---------------------------------

// Manager View
Bamazon.prototype.lowInvetory = function (low, callback) {
	this.db.query('SELECT * FROM products WHERE stock_quantity < ' + low, function (err, res) {
		if (err) throw err;
		callback(res);
	});
};
//---------------------------------
Bamazon.prototype.addInventory = function (item,quantity,callback) {
	this.db.query('UPDATE products SET stock_quantity = stock_quantity + '+quantity+' WHERE item_id ='+item, function (err) {
		if (err) throw err;
		callback();
	});
};
//---------------------------------
Bamazon.prototype.addProduct = function (prodObj,callback) {
	this.db.query('INSERT INTO products SET ?',prodObj , function (err) {
		if (err) throw err;
		callback();
	});
};









module.exports = Bamazon;