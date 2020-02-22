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
    promptMainMenu();
};


init();

async function promptMainMenu() {
    const menuAction = await inquirer.prompt(prompts.mainMenu);
    switch (menuAction.menuAction) {
        case (prompts.prompts.employee):
            promptEmployeeMenu();
            break;
        case (prompts.prompts.department):
            promptDepartmentMenu();
            break;
        case (prompts.prompts.exit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptEmployeeMenu() {
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
            promptMainMenu();
            break;
        case (prompts.prompts.exit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptDepartmentMenu() {
    const departmentAction = await inquirer.prompt(prompts.departmentMenu);
    switch (departmentAction.departmentAction) {
        case (prompts.prompts.viewDepartment):
            console.log('need to view all departments')
            break;
        case (prompts.prompts.addDepartment):
            console.log('need add new department func')
            break;
        case (prompts.prompts.deleteDepartment):
            console.log('need to edit department name func')
            break;
        case (prompts.prompts.back):
            promptMainMenu();
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
    promptEmployeeMenu();
};




async function promptAddEmployee() {
    const employeeObj = await inquirer.prompt(prompts.addEmployee);
    const department = await promptDepartmentSelection();

    const roleName = await promptDepartmentRoles(department);
    const departmentId = await getDepartmentIdByDepartmentName(department);

    const roleId = await getRoleIdByTitleAndDepartment(roleName, departmentId);

    const managerId = await getDepartmentManagerId(department);

    const newEmployee = new Employee(employeeObj.firstName, employeeObj.lastName, roleId, managerId);
    await insertNewEmployee(newEmployee);
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
        const rolesObj = await queryRolesByDepartment(department);
        const selectedRoleObj = await inquirer.prompt({
            type: 'list',
            message: `What is this employee's role?`,
            name: 'name',
            choices: rolesObj
        })
        return selectedRoleObj.name;
    } catch (err) {
        console.error(err);
    }
};

async function promptFindEmployeeMethod() {
    const selectedMethodObj = await inquirer.prompt(prompts.findEmployee);
    const method = selectedMethodObj.method;
    let employee;
    switch (method) {
        case (prompts.prompts.id):
            const idObj = await promptIdInput();
            employee = await queryEmployee(idObj);
            console.table(employee);
            promptFoundEmployee(idObj);
            break;
        case (prompts.prompts.firstName):
            const firstNameObj = await promptFirstNameInput();
            employee = await queryEmployee(firstNameObj);
            console.table(employee);
            promptFoundEmployee(firstNameObj);
            break;
        case (prompts.prompts.lastName):
            const lastNameObj = await promptLastNameInput();
            employee = await queryEmployee(lastNameObj);
            console.table(employee);
            promptFoundEmployee(lastNameObj);
            break;
        case (prompts.prompts.back):
            promptEmployeeMenu();
            break;
        case (prompts.prompts.exit):
            goodbye();
            break;
    };
};

async function promptFoundEmployee(obj) {
    const selectedMethodObj = await inquirer.prompt(prompts.foundEmployee);
    const method = selectedMethodObj.method;
    switch (method) {
        case (prompts.prompts.editEmployee):
            console.log('editing');
            break;
        case (prompts.prompts.deleteEmployee):
            deleteEmployee(obj);
            break;
        case (prompts.prompts.back):
            promptFindEmployeeMethod();
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

async function queryRolesByDepartment(department) {
    const rolesObj = await db.query(query.getDepartmentRoles, department);
    return rolesObj;
};

async function insertNewEmployee(Employee) {
    try {
        db.query(query.insertEmployee, Employee);
    } catch (err) {
        console.error(err);
    };
    return;
};

async function deleteEmployee(obj) {
    try {
        await db.query(query.deleteEmployee, obj);
        console.log('Employees deleted...');
        viewAllEmployee();
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

