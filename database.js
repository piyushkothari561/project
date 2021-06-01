require('dotenv/config');
const mysql = require('mysql');
const util = require('util');

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

const query = util.promisify(db.query).bind(db);

db.connect((err) => {
	if (err) {
		return console.log(err.message);
	}
});

db.on('connect', () => console.log('Connected to the DataBase'));

db.query('CREATE DATABASE IF NOT EXISTS projectdb', (err, result) => {
	if (err) {
		return console.log(err.message);
	}

	console.log('The database was successfully created');
});

db.query('USE projectdb', (err, result) => {
	if (err) {
		return console.log(err.message);
	}

	console.log('The selected database is projectdb');
});

db.query(
	'CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL)',
	(err, result) => {
		if (err) {
			return console.log(err.message);
		}

		console.log('The user table was created');
	}
);
db.query(
	'CREATE TABLE IF NOT EXISTS country_detail (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, countryName VARCHAR(255) UNIQUE NOT NULL, GMTOffset VARCHAR(50)  NOT NULL)',
	(err, result) => {
		if (err) {
			return console.log(err.message);
		}

		console.log('The countryDetail table was created');
	}
);

module.exports.db = db;
module.exports.query = query;
