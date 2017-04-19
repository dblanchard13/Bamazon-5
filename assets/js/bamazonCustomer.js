function BCustomer(){
	if(!(this instanceof BCustomer)){
		return new BCustomer();
	}
	this.Mysql = require('./queryDB.js');
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
	var queryDB = new this.Mysql;
	var id;
	var quantity;
	var idList = [];

	this.clearScreen();

	// list's all items
	queryDB.getAll(function (res) {

		// create a list with all products ID's
		res.forEach(function (prodID) {
			idList.push(prodID.item_id);
		});

		// display items in the table
		this.tableDisplay(res);

		// chose product by id
		this.inquire.prompt([
			{
				type: 'input',
				name: 'productID',
				message: 'Enter the ID of the product you want to buy:',
				validate: function (value) {
					if(idList.indexOf(parseInt(value)) !== -1){
						return true;
					}
				}
			}
		]).then(function (res) {
			id = res.productID;
			var stockStatus;

			queryDB.getStock(id,function (itemQuantity) {
				stockStatus = itemQuantity;
			});

			// chose quantity
			this.inquire.prompt([
				{
					type: 'input',
					name: 'quantity',
					message: 'Quantity:',
					validate: function (value) {
						if(value <= stockStatus){
							return true;
						} else {
							console.log('\n Stock Insuficient!');
						}
					}
				}
			]).then(function (res) {
				quantity = res.quantity;



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

