create database bamazonDB;

use bamazonDB;

create table products(
	item_id integer(11)auto_increment not null,
    product_name varchar(100) not null,
    department_name varchar(50),
    price decimal(10,2) not null,
    stock_quantity integer(10),
    primary key(item_id)
);

create table departments (
	department_id integer(11)auto_increment not null,
    department_name varchar(50) not null,
    over_head_costs decimal(10,2),
    total_sales decimal(10,2),
    primary key (department_id)
);
