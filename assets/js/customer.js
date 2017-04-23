function BCustomer() {
	if(!(this instanceof BCustomer)){
		return new BCustomer();
	}

	this.Bamazon = require('./bamazon.js');
	this.inquire = require('inquirer');
	this.customer = new this.Bamazon();
	this.userCart = [];
}

//-----------------------------------
BCustomer.prototype.userInput = function () {
	var self = this;
	var idList = [];
	var askID;
	var askQt;

	// display table with all items on screen
	self.customer.getAll(function (allProd) {
		var tableData;

		// Create a list of product ID's
		allProd.forEach(function (product) {
			idList.push(parseInt(product.item_id));
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

				self.customer.validatePurchase(id,qt, function (validStock) {
					if (validStock) {
						console.log('\nProduct saved in the Cart!\n');

						allProd.forEach(function (product) {
							if(product.item_id === id) {
								self.userCart.push({product: product, qt:qt});
							}
						});

					} else {
						console.log('\nInsufficient products in stock!\n');
					}
					self.buyOneMore();
				});
			});
		});
	});
};
//-----------------------------------
BCustomer.prototype.buyOneMore = function () {
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
			var prodList = [];

			if (res.userInput) {

				self.userInput();

			} else {
				self.customer.postOrder(self.userCart, function (cart) {
					var tableObj;

					cart.forEach(function (product) {
						var prodObj = {
							item_id: product.product.item_id,
							product_name: product.product.product_name,
							qt:product.qt,
							price: product.product.price,
							purchase: product.qt * product.product.price
						};
						prodList.push(prodObj);
					});

					tableObj = {
						head: ['ID', 'Product', 'Quantity', 'Price $', 'Purchase $'],
						body: prodList
					};
					self.customer.clearScreen();

					self.customer.tableDisplay(tableObj);
					self.customer.endConnection();

				});
			}
		});
	}, 1000);

};



var customer = BCustomer();

customer.userInput();


