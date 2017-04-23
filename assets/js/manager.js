function BManager() {
	if(!(this instanceof BManager)){
		return new BManager();
	}

	this.Bamazon = require('./bamazon.js');
	this.inquire = require('inquirer');
	this.manager = new this.Bamazon();
}

//---------------------------------
BManager.prototype.buyOneMore = function () {
	var self = this;
	var ask = [
		{
			type: 'confirm',
			name: 'userInput',
			message:'Back to main menu: ',
			default: true
		}
	];

	setTimeout(function () {
		self.inquire.prompt(ask).then(function (res) {
			if (res.userInput) {
				self.userInput();
			} else {
				self.manager.clearScreen();
				self.manager.endConnection();
			}
		});
	},1000);
};
//---------------------------------
BManager.prototype.userInput = function () {
	var self = this;
	var promptMainMenu = [
		{
			type: 'list',
			name: 'selected',
			message: 'Menu Options:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
		}
	];

	this.manager.clearScreen();
	this.inquire.prompt(promptMainMenu).then(function (res) {

		switch (res.selected) {
			case 'View Products for Sale':
				// Make DB request
				self.manager.getAll(function (allProd) {
					// Display items on table
					var tableData = {
						head: ['ID','Product','Price $', 'In Stock'],
						body: allProd
					};
					self.manager.tableDisplay(tableData, function () {
						self.buyOneMore();
					});
				});
			break;

			case 'View Low Inventory':
				// Make DB request
				self.manager.lowInvetory(5,function (lowProd) {
					// Display items on table
					var tableData = {
						head: ['ID','Product','Price $', 'In Stock'],
						body: lowProd
					};
					self.manager.tableDisplay(tableData, function () {
						self.buyOneMore();
					});
				});
			break;

			case 'Add to Inventory':
					var promptAddToInventory = [
						{
							type: 'input',
							name: 'item_id',
							message: 'Enter item ID:',
							validate: function (value) {
								if(parseInt(value) > 0){
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
					];
					self.inquire.prompt(promptAddToInventory).then(function (res) {
						self.manager.addInventory(res.item_id,res.quantity,function () {
							self.buyOneMore();
						});
					});
			break;

			case 'Add New Product':
				var promptNewItem = [
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
				];
				self.inquire.prompt(promptNewItem).then(function (newProd) {
					self.manager.addProduct(newProd,function () {
						self.buyOneMore();
					});
				});
			break;
		}
	});

};
//---------------------------------


var manager = new BManager();
manager.userInput();

