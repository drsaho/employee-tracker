const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'company_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
});

