'use strict'
console.clear();

const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');

console.log(prompts.brand);
inquirer.prompt(prompts.menu);

