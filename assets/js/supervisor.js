function BSupervisor() {
	if(!(this instanceof BSupervisor)){
		return new BSupervisor();
	}

	this.Bamazon = require('./bamazon.js');
	this.inquire = require('inquirer');
	this.manager = new this.Bamazon();
}
//--------------------------------------







var supervisor = new BSupervisor();

