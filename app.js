const express = require("express");
const mysql = require("mysql");
const serverApp = express();
require("dotenv").config();
const PORT = process.env.PORT;

// Middle ware to extract info from the html
serverApp.use(
  express.urlencoded({
    extended: true,
  })
);

//serverApp.use(express.json());

//create db connection params

const con = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// db connecting

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Route: / => Homepage route

serverApp.get("/", (req, res) => res.send("application running"));

//port listening

serverApp.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`My express server listening at http://localhost:${PORT}`);
});

//db tables creation

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

//route static form template or html

serverApp.use("/form", express.static("form"));

//route post of form data

serverApp.post("/addiphone", (req, res) => {
  res.send("trying to reseive data");
  console.table(req.body);
  const {
    product_name,
    product_url,
    product_descrpition,
    product_brief_descrpition,
    product_link,
    product_image,
    starting_price,
    price_range,
  } = req.body;

  // to ensert product table
  let insertToProduct = `INSERT INTO products (product_url, product_name) VALUES ("${product_url}","${product_name}")`;

  con.query(insertToProduct, (err, result, fields) => {
    if (err) console.log(`Error Found: ${err}`);
  });

  con.query(
    `SELECT * FROM products WHERE product_name = "${product_name}"`,
    (err, rows, fields) => {
      // Extracting Foreign key

      let product_id = rows[0].product_id;

      let insertToDescription = `INSERT INTO productdescription (product_id,product_brief_description, product_description, product_img, product_link) VALUES ("${product_id}", "${product_brief_descrpition}","${product_descrpition}","${product_image}","${product_link}")`;

      let inserttoPrice = `INSERT INTO productprice ( product_id,starting_price,price_range) VALUES ("${product_id}", "${starting_price}","${price_range}")`;

      //  enserting in to productdescirption table and price table

      con.query(insertToDescription, (err, result, fields) => {
        if (err) console.log(`Error Found: ${err}`);
      });
      con.query(inserttoPrice, (err, result, fields) => {
        if (err) console.log(`Error Found: ${err}`);
      });
    }
  );
  res.end("Data inserted to tables");
  console.log("Data inserted to tables");
});
