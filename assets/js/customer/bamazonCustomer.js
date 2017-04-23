function BCustomer(){
	if(!(this instanceof BCustomer)){
		return new BCustomer();
	}
	this.Mysql = require('./customerQueryDB.js');
	this.inquire = require('inquirer');
	this.Table = require('cli-table');
	this.colors = require('colors');

	this.queryDB = new this.Mysql;
}
//-------------------------
BCustomer.prototype.tableDisplay = function (dataObj) {
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
BCustomer.prototype.clearScreen = function () {
	console.log('\033c');
};
//-------------------------
BCustomer.prototype.checkout = function (product, quantity) {
	var totalPurchase = quantity * product.price;

	this.queryDB.postOrder(product.item_id, quantity);
	var prodCheckout = {
		item_id: product.item_id,
		product_name: product.product_name,
		stock_quantity: quantity,
		price: product.price,
		purchase: totalPurchase
	};

	this.clearScreen();
	// display items in the table
	this.tableDisplay({
		head:['Item_ID', 'Product','Quantity', 'Prise $', 'Total Purchase'],
		body:[prodCheckout]
	});
	this.queryDB.endConnection();
};
//-------------------------
BCustomer.prototype.uiMain = function () {
	var self = this;
	var id;
	var quantity;
	var idList = [];

	self.clearScreen();
	// list's all items
	self.queryDB.getAll(function (allProd) {

		// create a list with all products ID's
		allProd.forEach(function (prod) {
			idList.push(prod.item_id);
		});

		// display items in the table
		self.tableDisplay({
			head:['Item_ID', 'Product', 'Department', 'Prise $', 'In Stock'],
			body: allProd
		});

		// chose product by id
		self.inquire.prompt([
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
		]).then(function (product) {
			id = parseInt(product.productID);

			self.queryDB.getStock(id,function (currentStock) {
				// chose quantity
				self.inquire.prompt([
					{
						type: 'input',
						name: 'quantity',
						message: 'Quantity:',
						validate: function (value) {
							if(value <= currentStock && value > 0){
								return true;
							} else {
								console.log('\n Insufficient quantity!');
							}
						}
					}
				]).then(function (quantitySelected) {

					allProd.forEach(function (thisProduct) {

						if(thisProduct.item_id === id) {
							self.checkout(thisProduct,parseInt(quantitySelected.quantity));
						}

					});
				});
			});
		});
	});


};





var customer = new BCustomer();


customer.uiMain();