'use strict'
console.clear();

const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const query = require('./queries');
const Employee = require('./classes/employee');
const Department = require('./classes/department');
const Role = require('./classes/role');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB'
});

const init = () => {
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
            endConnection();
            break;
        default:
            break;
    };
};

async function employeePrompt() {
    const employeeAction = await inquirer.prompt(prompts.employeeMenu);
    switch (employeeAction.employeeAction) {
        case (prompts.prompts.viewAllEmployee):
            viewAllEmployee();
            break;
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
            endConnection();
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
            endConnection();
            break;
        default:
            break;
    };
};

function viewAllEmployee() {
    connection.query(query.viewAllEmployees, (err, res) => {
        if (err) throw err;
        console.table(res);
        employeePrompt();
    });
};

async function addEmployee() {
    const employeeObj = await inquirer.prompt(prompts.employee);
    const role = await rolePrompt(employeeObj.department);
    const mgr = await findManager(employeeObj.department);

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
    let managerNameArr = [];
    let managerIdArr = [];
    let managerObjArr = [];
    connection.query(query.findManagerQuery, department, (err, resObjs) => {
        if (err) throw err;
        if (resObjs) {
            for (const resObj of resObjs) {
                managerNameArr.push(resObj.name);
                managerIdArr.push(resObj.id);
            };
        };
        const manager = inquirer.prompt({
            type: 'list',
            message: `Who is this employee's manager?`,
            name: 'manager',
            choices: managerObjArr
        })
        console.log(manager);
        return manager.manager;
    })
};


const endConnection = () => {
    console.log('Goodbye!');
    connection.end();
};

init();

// findManager('Engineering');

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