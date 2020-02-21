'use strict'

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
};

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
            goodbye();
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
            promptFindEmployeeMethod();
            break;
        case (prompts.prompts.addEmployee):
            promptAddEmployee();
            break;
        case (prompts.prompts.back):
            menuPrompt();
            break;
        case (prompts.prompts.exit):
            goodbye();
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
            goodbye();
            break;
        default:
            break;
    };
};

async function viewAllEmployee() {
    const allEmployees = await queryAllEmployees();
    console.table(allEmployees);
    employeePrompt();
};




async function promptAddEmployee() {
    const employeeObj = await inquirer.prompt(prompts.addEmployee);
    const department = await promptDepartmentSelection();
    console.log(department)

    const roleName = await promptDepartmentRoles(department);
    const departmentId = await getDepartmentIdByDepartmentName(department);

    const roleId = await getRoleIdByTitleAndDepartment(roleName, departmentId);

    const managerId = await getDepartmentManagerId(department);

    const newEmployee = new Employee(employeeObj.firstName, employeeObj.lastName, roleId, managerId);
    await db.query(query.addEmployee, newEmployee, (err, res) => {
        if (err) throw err;
        console.log(`\n${res.affectedRows} employee added.\n`);
    });
    viewAllEmployee();
};

async function promptDepartmentSelection() {
    try {
        const departmentObjArr = await queryAllDepartments();
        const selectedDepartmentObj = await inquirer.prompt({
            type: 'list',
            message: `What is this employee's department?`,
            name: 'name',
            choices: departmentObjArr
        })
        return selectedDepartmentObj.name;
    } catch (err) {
        console.error(err)
    };
};

async function promptDepartmentRoles(department) {
    try {
        const departmentRoleObjArr = await db.query(query.getDepartmentRoles, department);
        const selectedRoleObj = await inquirer.prompt({
            type: 'list',
            message: `What is this employee's role?`,
            name: 'name',
            choices: departmentRoleObjArr
        })
        return selectedRoleObj.name;
    } catch (err) {
        console.error(err);
    }
};

async function promptFindEmployeeMethod() {
    const selectedMethod = await inquirer.prompt(prompts.findEmployee);
    const method = selectedMethod.method;
    switch (method) {
        case (prompts.prompts.id):
            const idObj = await promptIdInput();
            const employee = await queryEmployee(idObj);
            console.table(employee);
            break;
        case (prompts.prompts.firstName):
            promptFirstNameInput();
            break;
        case (prompts.prompts.lastName):
            promptLastNameInput();
            break;
        case (prompts.prompts.back):
            employeePrompt();
            break;
        case (prompts.prompts.exit):
            goodbye();
            break;
    };
};

async function promptIdInput() {
    const idObj = await inquirer.prompt(prompts.idInupt);
    console.log(idObj);
    return idObj;
};

async function promptFirstNameInput() {
    const firstNameObj = await inquirer.prompt(prompts.firstNameInupt);
    console.log(firstNameObj);
    return firstNameObj;
};

async function promptLastNameInput() {
    const lastNameObj = await inquirer.prompt(prompts.lastNameInupt);
    console.log(lastNameObj);
    return lastNameObj;
};

// SQL functions
async function queryAllEmployees() {
    try {
        return db.query(query.viewAllEmployees)
    } catch (err) {
        console.error(err);
    };
};

async function queryEmployee(obj) {
    try {
        return await db.query(query.findEmployee, obj);
    } catch (err) {
        console.error(err);
    };
};

async function queryAllDepartments() {
    try {
        return await db.query(query.getAllDepartments);
    } catch (err) {
        console.error(err);
    };
};

async function getRoleIdByTitleAndDepartment(role, departmentId) {
    try {
        const roleObj = await db.query(query.getRoleIdByTitleAndDepartment, [role, departmentId]);
        return roleObj[0].id;
    } catch (err) {
        console.error(err);
    };
};

async function getDepartmentIdByDepartmentName(department) {
    try {
        const departmentObj = await db.query(query.getDepartmentIdByDepartmentName, { name: department });
        return departmentObj[0].id;
    } catch (err) {
        console.error(err);
    };
};


async function getDepartmentManagerId(department) {
    let managerNameArr = ['None'];
    try {
        const managerObjArr = await db.query(query.findDepartmentManagerQuery, department);
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
            return null;
        };
        const selectedManager = managerNameArr.filter(manager => manager.name === selectedManagerName.name);
        return selectedManager[0].id;
    } catch (err) {
        console.error(err)
    }
};

const goodbye = () => {
    console.clear();
    console.log('Goodbye!');
    db.close();
};

