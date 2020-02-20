'use strict'
console.clear();

const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const Employee = require('./classes/employee');
const Department = require('./classes/department');
const Role = require('./classes/role');

const newE = new Employee('Richard', 'Wang', 123, 456, 789);
// const newD = new Department(123, 'Finance');
// console.log(newE);
// console.log(newD);

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB'
});

// init();

function init() {
    console.log(prompts.brand);
    menuPrompt();
};

async function menuPrompt() {
    const menuAction = await inquirer.prompt(prompts.mainMenu);
    switch (menuAction.menuAction) {
        case (prompts.prompts.employee):
            employeePrompt();
            break;
        case (prompts.prompts.department):
            departmentPrompt();
            break;
        case (prompts.prompts.exit):
            console.log(`Goodbye!`);
            break;
        default:
            break;
    };
};

async function employeePrompt() {
    const employeeAction = await inquirer.prompt(prompts.employeeMenu);
    switch (employeeAction.employeeAction) {
        case (prompts.prompts.findEmployee):
            console.log('going to find a emp')
            break;
        case (prompts.prompts.addEmployee):
            addEmployee();
            break;
        case (prompts.prompts.editEmployee):
            console.log('going to edit emp')
            break;
        case (prompts.prompts.deleteEmployee):
            console.log('going to delete emp')
            break;
        case (prompts.prompts.back):
            menuPrompt();
            break;
        case (prompts.prompts.exit):
            break;
        default:
            break;
    };
};

async function departmentPrompt() {
    const departmentAction = await inquirer.prompt(prompts.departmentMenu);
    switch (departmentAction.departmentAction) {
        case (prompts.prompts.viewDepartment):
            console.log('going to find a emp')
            break;
        case (prompts.prompts.addDepartment):
            console.log('need add emp func')
            break;
        case (prompts.prompts.deleteDepartment):
            console.log('need edit emp func')
            break;
        case (prompts.prompts.back):
            menuPrompt();
            break;
        case (prompts.prompts.exit):
            break;
        default:
            break;
    };
};


async function addEmployee() {
    const employeeObj = await inquirer.prompt(prompts.employee);
    const role = await rolePrompt(employeeObj.department);
    const mgrArr = await findManager(employeeObj.department);
    console.log(mgrArr);
}

async function rolePrompt(department) {
    switch (department) {
        case (`Finance`):
            return await inquirer.prompt(prompts.role.finance);
        case (`Engineering`):
            return await inquirer.prompt(prompts.role.engineering);
        case (`Marketing`):
            return await inquirer.prompt(prompts.role.marketing);
        default:
            break;
    };
}

async function findManager(department) {
    let managerArr = [];
    connection.query(
        `SELECT concat(e.first_name, ' ', e.last_name) as name, e.id
        FROM employee e 
            join role r 
            on e.role_id = r.id 
            join department d 
            on r.department_id = d.id 
        WHERE d.name = '${department}' and r.title = 'Manager'`, (err, resObjs) => {
        if (err) throw err;
        if (resObjs) {
            for (const resObj of resObjs) {
                console.log(resObj);
                const managerObj = { name: resObj.name, id: resObj.id };
                console.log(managerObj);
                managerArr.push(managerObj);
            }
            return managerArr;
        };
    })
    connection.end();
};

addEmployee();

// const table = cTable.getTable([
//     {
//         name: 'foo',
//         age: 10
//     }, {
//         name: 'bar',
//         age: 20
//     }
// ])

// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);











// connect to SQL database
// connection.connect(err => {
//     if (err) throw err;
//     console.log(`connected with id  ${connection.threadId}`);
//     connection.end();
// });