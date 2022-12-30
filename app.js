const express = require("express");
const mysql = require("mysql");
const serverApp = express();
require("dotenv").config();
const PORT = process.env.PORT;


const con = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
serverApp.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`My express server listening at http://localhost:${PORT}`);
});

serverApp.get("/install", function (req, res) {
  //create product table
  let Products = `CREATE TABLE if not exists Products(
      product_id int auto_increment,
      product_url varchar(255) not null,
      product_name varchar(255) not null,
      PRIMARY KEY (product_id)
  )`;
  con.query(Products, (err, results) => {
    if (err) console.log(err);
    console.log("<h1>created product table<h1/>");
  });

  // create ProductDescription table
  let ProductDescription = `CREATE TABLE if not exists ProductDescription(
    description_id int auto_increment,
    product_id int(11) not null,
    product_brief_description TEXT not null,
    product_description TEXT not null,
    product_img varchar(255) not null,
    product_link varchar(255) not null,
    PRIMARY KEY (description_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;

  con.query(ProductDescription, (err, results) => {
    if (err) console.log(err);
    console.log("<h1>created ProductDescription table<h1/>");
  });

  // create table ProductPrice
  let ProductPrice = `CREATE TABLE if not exists ProductPrice(
    price_id int auto_increment,
    product_id int(11) not null,
    starting_price varchar(255) not null,
    price_range varchar(255) not null,
    PRIMARY KEY (price_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;
  con.query(ProductPrice, (err, results) => {
    if (err) console.log(err);
    console.log("<h1> created ProductPrice table<h1/>");
  });

  // create table user
  let user = `CREATE TABLE if not exists User(
    user_id int auto_increment,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    PRIMARY KEY (user_id)
  )`;
  con.query(user, (err, results) => {
    if (err) console.log(err);
    console.log("<h1>created user table<h1/>");
  });

  //create order table

  let order = `CREATE TABLE if not exists Orders(
    order_id int auto_increment,
    product_id int(11) not null,
    user_id int(11) not null,
    PRIMARY KEY (order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
  )`;
  con.query(order, (err, results) => {
    if (err) console.log(err);
    res.send("<h1>created table<h1/>");
  });
});

serverApp.use("/form", express.static("display"));
