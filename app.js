'use strict'
console.clear();

const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB'
});



// console.log(prompts.brand);
inquirer.prompt(prompts.employee);









// connect to SQL database
// connection.connect(err => {
//     if (err) throw err;
//     console.log(`connected with id  ${connection.threadId}`);
//     connection.end();
// });