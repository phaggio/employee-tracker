'use strict'
console.clear();

const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const cTable = require('console.table');
const prompts = require('./prompts');
const query = require('./queries');
const Employee = require('./classes/employee');
const Department = require('./classes/department');
const Role = require('./classes/role');

const sqlConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB'
}

function connectDatabase(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
};

const db = connectDatabase(sqlConfig);

// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: 'password',
//     database: 'employeesDB'
// });

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
    const roleObj = await rolePrompt(employeeObj.department);
    const managerId = await getManagerId(employeeObj.department);

    console.log(employeeObj, roleObj, managerId);
};

addEmployee();

async function getDepartmentId(department) {
    connection.query(query.getDepartmentId, { name: department }, (err, id) => {
        if (err) throw err;
        console.log(`Passing ${id[0].id}`);
        return id[0].id;
    });
};

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
};

async function getManagerId(department) {
    let managerNameArr = ['None'];
    try {
        const managerObjArr = await db.query(query.findManagerQuery, department);
        for (const managerObj of managerObjArr) {
            managerNameArr.push(managerObj);
        }
        const selectedManagerName = await inquirer.prompt({
            type: 'list',
            message: `Who is this employee's manager?`,
            name: 'name',
            choices: managerNameArr
        });
        if (selectedManagerName.name === 'None') {
            console.log(null);
            return null;
        };
        const selectedManager = managerNameArr.filter(manager => manager.name === selectedManagerName.name);
        // console.log(selectedManager[0].id);
        return selectedManager[0].id;
    } catch (err) {
        console.error(err)
    } finally {
        await db.close();
    }


    // , (err, resObjs) => {
    // if (err)
    //     throw err;
    // if (resObjs) {
    //     for (const resObj of resObjs) {
    //         managerNameArr.push(resObj.name);
    //     }
    // }
    // return managerNameArr;
    // const selectedMgrNameObj = await inquirer.prompt({
    //     type: 'list',
    //     message: `Who is this employee's manager?`,
    //     name: 'name',
    //     choices: managerObjArr
    // });
    // if (selectedMgrNameObj.name === 'None') {
    //     return null;
    // };
    // let selectedMgrArr = managerObjArr.filter(manager => manager.name === selectedMgrNameObj.name);
    // console.log(selectedMgrArr[0].id);
    // return selectedMgrArr[0].id;

};


const endConnection = () => {
    console.log('Goodbye!');
    connection.end();
};

// init();

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

