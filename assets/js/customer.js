function BCustomer() {
	if(!(this instanceof BCustomer)){
		return new BCustomer();
	}

	this.Bamazon = require('./bamazon.js');
	this.inquire = require('inquirer');
	this.customer = new this.Bamazon();
}
//-----------------------------------
BCustomer.prototype.checkout = function (product, quantity) {
	var totalPurchase = quantity * product.price;
	var prodCheckout = {
		item_id: product.item_id,
		product_name: product.product_name,
		stock_quantity: quantity,
		price: product.price,
		purchase: totalPurchase
	};
	this.customer.postOrder(product.item_id, quantity);
	this.customer.clearScreen();
	// display items in the table
	this.customer.tableDisplay({
		head:['Item_ID', 'Product','Quantity', 'Prise $', 'Total Purchase'],
		body:[prodCheckout]
	});
};
//-----------------------------------
BCustomer.prototype.userInput = function () {
	var self = this;
	var idList = [];
	var prodList = [];
	var askID;
	var askQt;

	// display table with all items on screen
	self.customer.getAll(function (allProd) {
		var tableData;

		// Create a list of product ID's
		allProd.forEach(function (product) {
			idList.push(parseInt(product.item_id));
			prodList.push(product);
		});
		// Create obj table to pass into display function table
		tableData = {
			head: ['ID','Product','Price $', 'In Stock'],
			body: allProd
		};

		self.customer.tableDisplay(tableData);

		// Prompt Questions
		askID = [
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
		];
		askQt = [
			{
				type: 'input',
				name: 'qt',
				message: 'Quantity:',
				validate: function (value) {
					if(value > 0){
						return true;
					} else {
						console.log('\n Insufficient quantity!');
					}
				}
			}
		];

		self.inquire.prompt(askID).then(function (res) {
			var id = parseInt(res.productID);
			self.inquire.prompt(askQt).then(function (res) {
				var qt = parseInt(res.qt);
				self.customer.clearScreen();

				prodList.forEach(function (product) {
					if (product.item_id === id) {
						self.checkout(product,qt);
					}
				});
				self.tryAgain();

			});
		});
	});






};
//-----------------------------------
BCustomer.prototype.tryAgain = function () {
	var self = this;
	var ask = [
		{
			type: 'confirm',
			name: 'userInput',
			message:'Do you want to buy another item? ',
			default: true
		}
	];

	//TODO (Developer) find a diferent way to solve the async behavior
	setTimeout(function(){
		self.inquire.prompt(ask).then(function (res) {
			if (res.userInput) {
				self.userInput();
			} else {
				self.customer.clearScreen();
				self.customer.endConnection();
			}
		});
	}, 1000);

};






var customer = BCustomer();

customer.userInput();


