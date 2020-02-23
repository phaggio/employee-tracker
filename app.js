'use strict'

const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const cTable = require('console.table');
const clear = require('clear');

const userInput = require('./assets/prompts/userInputPrompts');
const mainPrompt = require('./assets/prompts/mainPrompts');
const employeePrompt = require('./assets/prompts/employeePrompts');

const query = require('./assets/queries/queries');
const queryFunctions = require('./assets/queries/queryFunctions');

const Employee = require('./assets/classes/employee');
const Department = require('./assets/classes/department');
const Role = require('./assets/classes/role');

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
    console.log(mainPrompt.brand);
    promptMainMenu();
};


const employeeMenuHeading = () => console.log(`\n---------- Employee Menu ----------\n`);
const departmentMenuHeading = () => console.log(`\n---------- Department Menu ----------\n`);

async function promptMainMenu() {
    const menuAction = await inquirer.prompt(mainPrompt.mainMenu);
    switch (menuAction.menuAction) {
        case (mainPrompt.selection.employee):
            promptEmployeeMenu();
            break;
        case (mainPrompt.selection.department):
            promptDepartmentMenu();
            break;
        case (mainPrompt.selection.role):
            console.log('need role menu and queries');
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptEmployeeMenu() {
    employeeMenuHeading();
    const employeeAction = await inquirer.prompt(employeePrompt.employeeMenu);
    switch (employeeAction.employeeAction) {
        case (mainPrompt.selection.viewAllEmployees):
            viewAllEmployee();
            break;
        case (mainPrompt.selection.findEmployee):
            promptFindEmployeeMethod();
            break;
        case (mainPrompt.selection.addEmployee):
            promptAddEmployee();
            break;
        case (mainPrompt.selection.back):
            promptMainMenu();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptDepartmentMenu() {
    departmentMenuHeading();
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
        case (mainPrompt.selection.back):
            promptMainMenu();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
        default:
            break;
    };
};


async function viewAllEmployee() {
    const allEmployees = await queryFunctions.queryAllEmployees();
    console.table(allEmployees);
    promptEmployeeMenu();
};

async function viewSelectedEmployee(methodObj) {
    clear();
    const selectedEmployee = await queryEmployee(methodObj);
    console.table(selectedEmployee);
    promptFoundEmployee(methodObj);
    // promptFoundEmployee(selectedEmployee);
};

async function promptAddEmployee() {
    const firstNameObj = await promptFirstNameInput();
    const lastNameObj = await promptLastNameInput();
    const departmentName = await promptDepartmentSelection();
    const roleName = await promptDepartmentRoles(departmentName);

    const departmentId = await getDepartmentIdByDepartmentName(departmentName);
    const roleId = await getRoleIdByTitleAndDepartment(roleName, departmentId);

    const managerId = await promptDepartmentManager(departmentName);

    const newEmployee = new Employee(firstNameObj.first_name, lastNameObj.last_name, roleId, managerId);
    await insertNewEmployee(newEmployee);
    viewAllEmployee();
};

async function promptDepartmentSelection() {
    const departmentObjArr = await queryAllDepartments();
    const selectedDepartmentObj = await inquirer.prompt({
        type: 'list',
        message: `What is employee(s)'s department?`,
        name: 'name',
        choices: departmentObjArr
    })
    return selectedDepartmentObj.name;
};

async function promptDepartmentRoles(department) {
    try {
        const rolesObj = await queryRolesByDepartment(department);
        const selectedRoleObj = await inquirer.prompt({
            type: 'list',
            message: `What is employee's role?`,
            name: 'name',
            choices: rolesObj
        })
        return selectedRoleObj.name;
    } catch (err) {
        console.error(err);
    }
};


async function promptDepartmentManager(department) {
    let managerNameArr = ['None'];
    try {
        const managerObjArr = await queryDepartmentManager(department);
        for (const managerObj of managerObjArr) {
            managerNameArr.push(managerObj);
        }
        const selectedManagerName = await inquirer.prompt({
            type: 'list',
            message: `Who is the employee's manager?`,
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
    };
};

async function promptFindEmployeeMethod() {
    const selectedMethodObj = await inquirer.prompt(prompts.findEmployee);
    const method = selectedMethodObj.method;
    switch (method) {
        case (prompts.prompts.id):
            viewSelectedEmployee(await promptIdInput());
            break;
        case (prompts.prompts.firstName):
            viewSelectedEmployee(await promptFirstNameInput());
            break;
        case (prompts.prompts.lastName):
            viewSelectedEmployee(await promptLastNameInput());
            break;
        case (mainPrompt.selection.back):
            promptEmployeeMenu();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
    };
};

async function promptFoundEmployee(methodObj) {
    const selectedMethodObj = await inquirer.prompt(prompts.foundEmployee);
    const method = selectedMethodObj.method;
    switch (method) {
        case (prompts.prompts.editEmployee):
            await promptEditEmployee(methodObj);
            break;
        case (prompts.prompts.deleteEmployee):
            await deleteEmployee(methodObj);
            viewAllEmployee();
            break;
        case (mainPrompt.selection.back):
            promptFindEmployeeMethod();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
    };
};

async function promptEditEmployee(methodObj) {
    const selectedEditObj = await inquirer.prompt(prompts.editEmployee);
    const edit = selectedEditObj.edit;
    switch (edit) {
        case (prompts.prompts.firstName):
            const newFirstNameObj = await promptFirstNameInput();
            await updateEmployee(newFirstNameObj, methodObj);
            viewSelectedEmployee(methodObj);
            break;
        case (prompts.prompts.lastName):
            const newLastNameObj = await promptLastNameInput();
            await updateEmployee(newLastNameObj, methodObj);
            viewSelectedEmployee(methodObj);
            break;
        case (prompts.prompts.departmentAndRole):
            const newDepartmentName = await promptDepartmentSelection();
            const newRoleName = await promptDepartmentRoles(newDepartmentName);

            const departmentId = await getDepartmentIdByDepartmentName(newDepartmentName);
            const roleId = await getRoleIdByTitleAndDepartment(newRoleName, departmentId);
        
            const managerId = await promptDepartmentManager(newDepartmentName);

            await updateEmployee({role_id: roleId, manager_id: managerId}, methodObj);
            viewSelectedEmployee(methodObj);
            break;
        case (prompts.prompts.manager):
            const departmentNameArr = await querySelectedEmployeeDepartments(methodObj);
            const newManagerId = await promptDepartmentManager(departmentNameArr);
            await updateEmployee({manager_id: newManagerId}, methodObj);
            viewSelectedEmployee(methodObj);
            break;
        case (mainPrompt.selection.back):
            promptFindEmployeeMethod();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
        default:
            break;
    };
};


async function promptIdInput() {
    const idObj = await inquirer.prompt(prompts.idInupt);
    return idObj;
};

async function promptFirstNameInput() {
    const firstNameObj = await inquirer.prompt(prompts.firstNameInupt);
    return firstNameObj;
};

async function promptLastNameInput() {
    const lastNameObj = await inquirer.prompt(prompts.lastNameInupt);
    return lastNameObj;
};




async function queryEmployee(obj) {
    try {
        return await db.query(query.findEmployee, obj);
    } catch (err) {
        console.error(err);
    };
};

async function querySelectedEmployeeDepartments(methodObj) {
    try {
        const departmentObjArr =  await db.query(query.findEmployeeDepartments, methodObj);
        let departmentNameArr = [];
        for (const obj of departmentObjArr) {
            departmentNameArr.push(obj.name);
        }
        return departmentNameArr;
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

async function updateEmployee(updateObj, whereObj) {
    console.log(updateObj);
    try {
        await db.query(query.updateEmployee, [updateObj, whereObj]);
        console.log(`\nEmployee(s) Updated!\n`)
    } catch (err) {
        console.error(err);
    };
    return;
};

async function deleteEmployee(obj) {
    try {
        await db.query(query.deleteEmployee, obj);
        console.log(`\nEmployee(s) Deleted!\n`);
    } catch (err) {
        console.error(err);
    };
    return;
};

async function queryAllDepartments() {
    try {
        return await db.query(query.getAllDepartments);
    } catch (err) {
        console.error(err);
    };
};

async function queryDepartmentManager(department) {
    try {
        const managerObjArr = await db.query(query.findDepartmentManagerQuery, department);
        return managerObjArr;
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


const goodbye = () => {
    console.clear();
    console.log('Goodbye!');
    queryFunctions.db.close()
};

