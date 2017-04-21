function Bmanager(){
	if(!(this instanceof Bmanager)){
		return new Bmanager();
	}
	this.Mysql = require('./managerQueryDB.js');
	this.inquire = require('inquirer');
	this.Table = require('cli-table');
	this.colors = require('colors');

	this.queryDB = new this.Mysql;
}


//-------------------------
Bmanager.prototype.tableDisplay = function (dataObj) {
	var table = new this.Table({
		head: dataObj.head
	});

	dataObj.body.forEach(function (thisProduct) {
		var row = [];

		if(thisProduct.purchase){
			row = [thisProduct.item_id, thisProduct.product_name, thisProduct.stock_quantity, thisProduct.price, thisProduct.purchase];
			table.push(row);
		} else {
			row = [thisProduct.item_id, thisProduct.product_name, thisProduct.department_name, thisProduct.price, thisProduct.stock_quantity];
			table.push(row);
		}
	});
	console.log(table.toString());
};
//-------------------------
Bmanager.prototype.clearScreen = function () {
	console.log('\033c');
};
//-------------------------
Bmanager.prototype.uiMain = function () {
	var self = this;

	this.inquire.prompt([
		{
			type: 'list',
			name: 'selected',
			message: 'Menu Options:',
			choices: [
				'View Products for Sale',
				'View Low Inventory',
				'Add to Inventory',
				'Add New Product'
			]
		}
	]).then(function (res) {
		switch (res.selected) {
			case 'View Products for Sale':
				self.clearScreen();

				self.queryDB.getAll(function (products) {
					// display items in the table
					self.tableDisplay({
						head:['Item_ID', 'Product', 'Department', 'Prise $', 'In Stock'],
						body: products
					});
				});
			break;
			case 'View Low Inventory':
				self.clearScreen();

				self.queryDB.lowInvetory(5, function (lowProducts) {
					// display items in the table
					self.tableDisplay({
						head:['Item_ID', 'Product', 'Department', 'Prise $', 'In Stock'],
						body: lowProducts
					});
				});
			break;
			case 'Add to Inventory':
				self.clearScreen();

				self.queryDB.getAll(function (products) {
					var idList = [];

					// create a list with all products ID's
					products.forEach(function (prod) {
						idList.push(prod.item_id);
					});
					// display items in the table
					self.tableDisplay({
						head:['Item_ID', 'Product', 'Department', 'Prise $', 'In Stock'],
						body: products
					});

					self.inquire.prompt([
						{
							type: 'input',
							name: 'itemId',
							message: 'Enter item ID:',
							validate: function (value) {
								if(idList.indexOf(parseInt(value)) !== -1){
									return true;
								}
							}
						},
						{
							type: 'input',
							name: 'quantity',
							message:'Quantity to be Add:',
							validate: function (value) {
								if(parseInt(value) > 0){
									return true;
								}
							}
						}
					]).then(function (prod) {
						console.log(prod.quantity, prod.itemId);
						self.queryDB.addInventory(prod.itemId, prod.quantity);
					});
				});
			break;
			case 'Add New Product':
				self.inquire.prompt([
					{
						type: 'input',
						name: 'product_name',
						message: 'Product:',
					},
					{
						type: 'input',
						name: 'department_name',
						message: 'Department:',
					},
					{
						type: 'input',
						name: 'price',
						message: 'Price $:',
					},
					{
						type: 'input',
						name: 'stock_quantity',
						message: 'Initial Stock:',
					}
				]).then(function (newProd) {
					self.queryDB.addProduct(newProd);
				});
			break;
		}
	});
};
//-------------------------



var myUi = new Bmanager();
myUi.uiMain();