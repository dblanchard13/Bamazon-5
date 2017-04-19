function BCustomer(){
	if(!(this instanceof BCustomer)){
		return new BCustomer();
	}
	this.mysql = require('./queryDB.js');
	this.inquire = require('inquirer');
	this.Table = require('cli-table');
	this.colors = require('colors');
}
//-------------------------
BCustomer.prototype.tableDisplay = function (products) {
	var table = new this.Table({
		head: ['Item_ID', 'Product', 'Department', 'Prise $', 'In Stock']
	});
	products.forEach(function (thisProduct) {
		table.push([thisProduct.item_id, thisProduct.product_name, thisProduct.department_name, thisProduct.price, thisProduct.stock_quantity]);
	});
	console.log(table.toString());
};
//-------------------------
BCustomer.prototype.clearScreen = function () {
	console.log('\033c');
};
//-------------------------
BCustomer.prototype.uiMain = function () {
	var queryDB = new this.mysql;
	var id;
	var quantity;
	var prodList;

	this.clearScreen();

	// list's all items
	queryDB.getAll(function (res) {
		prodList = res;

		// display items in table
		this.tableDisplay(res);

		// chose product by id
		this.inquire.prompt([
			{
				type: 'input',
				name: 'productID',
				message: 'Enter the ID of the product you want to buy:'
			}
		]).then(function (res) {
			id = res.productID;

			// chose quantity
			this.inquire.prompt([
				{
					type: 'input',
					name: 'quantity',
					message: 'Quantity: '
				}
			]).then(function (res) {
				quantity = res.quantity;

				queryDB.getStock(id,function (item) {
					console.log(item);
				});

				queryDB.endConnection();
				this.clearScreen();
			}.bind(this));
		}.bind(this));
	}.bind(this));


};

var customer = new BCustomer();


customer.uiMain();

/*customer.query('get_all',[],function (res) {
		customer.tableDisplay(res);
});

customer.query('get_stock_by_id',[{item_id: 3}], function (res) {
	customer.tableDisplay(res);
});*/

