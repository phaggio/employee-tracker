'use strict'

const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const cTable = require('console.table');
const clear = require('clear');

const userInputPrompt = require('./assets/prompts/userInputPrompts');
const mainPrompt = require('./assets/prompts/mainPrompts');
const employeePrompt = require('./assets/prompts/employeePrompts');
const departmentPrompt = require('./assets/prompts/departmentPrompts');

const query = require('./assets/queries/queries');
const queryFunctions = require('./assets/queries/queryFunctions');

const Employee = require('./assets/classes/employee');
const Department = require('./assets/classes/department');
const Role = require('./assets/classes/role');

// const sqlConfig = {
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: 'password',
//     database: 'employeesDB'
// };

// function connectDatabase(config) {
//     const connection = mysql.createConnection(config);
//     return {
//         query(sql, args) {
//             return util.promisify(connection.query)
//                 .call(connection, sql, args);
//         },
//         close() {
//             return util.promisify(connection.end).call(connection);
//         }
//     };
// };

// const db = connectDatabase(sqlConfig);


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
            promptFindEmployeeMenu();
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
    const departmentAction = await inquirer.prompt(departmentPrompt.departmentMenu);
    switch (departmentAction.departmentAction) {
        case (mainPrompt.selection.viewAllDepartments):
            viewAllDepartments();
            break;
        case (mainPrompt.selection.addDepartment):
            console.log('need add new department func')
            break;
        case (mainPrompt.selection.deleteDepartment):
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

async function viewAllDepartments() {
    const allDepartments = await queryFunctions.queryAllDepartments();
    console.table(allDepartments);
    promptDepartmentMenu();
};

async function viewSelectedEmployee(inputObj) {
    const selectedEmployeeObjArr = await queryFunctions.querySelectedEmployee(inputObj);
    console.table(selectedEmployeeObjArr);
    const selectedIdObjArr = await queryFunctions.queryEmployeeId(inputObj);
    promptSelectOneEmployee(selectedIdObjArr);
};

async function promptAddEmployee() {
    const firstNameObj = await inquirer.prompt(userInputPrompt.firstNameInupt);
    const lastNameObj = await inquirer.prompt(userInputPrompt.lastNameInupt);
    const departmentObj = await promptDepartmentSelection();
    const roleObj = await promptDepartmentRolesSelection(departmentObj.name);
    const managerObj = await promptDepartmentManagerSelection(departmentObj.name);
    const newEmployee = new Employee(firstNameObj.first_name, lastNameObj.last_name, roleObj.id, managerObj.id);
    await queryFunctions.insertEmployee(newEmployee);
    viewAllEmployee();
};

async function promptDepartmentSelection() {
    const departmentObjArr = await queryFunctions.queryAllDepartments();
    const selectedDepartmentObj = await inquirer.prompt({
        type: 'list',
        message: `What is employee's department?`,
        name: 'name',
        choices: departmentObjArr
    });
    if (!departmentObjArr) {
        console.error('No department found');
    } else {
        for (const departmentObj of departmentObjArr) {
            if (departmentObj.name === selectedDepartmentObj.name) {
                console.log(departmentObj);
                return departmentObj;
            };
        };
    };
    return;
};

async function promptDepartmentRolesSelection(departmentName) {
    const roleObjArr = await queryFunctions.queryRolesByDepartment(departmentName);
    const selectedRoleObj = await inquirer.prompt({
        type: 'list',
        message: `What is employee's role?`,
        name: 'name',
        choices: roleObjArr
    });
    if (!roleObjArr) {
        console.error('No role found');
    } else {
        for (const roleObj of roleObjArr) {
            if (roleObj.name === selectedRoleObj.name) {
                console.log(roleObj);
                return roleObj;
            };
        };
    };
    return;
};

async function promptDepartmentManagerSelection(departmentName) {
    let managerObjArr = await queryFunctions.queryDepartmentManager(departmentName);
    if (!managerObjArr) {
        managerObjArr = [];
    };
    managerObjArr.push({ name: 'None', id: null });
    const selectedManagerObj = await inquirer.prompt({
        type: 'list',
        message: `Who is the employee's manager?`,
        name: 'name',
        choices: managerObjArr
    });
    for (const managerObj of managerObjArr) {
        if (managerObj.name === selectedManagerObj.name) {
            console.log(managerObj);
            return managerObj;
        };
    };
    return;
};


async function promptFindEmployeeMenu() {
    const selectedMethodObj = await inquirer.prompt(employeePrompt.findEmployee);
    const method = selectedMethodObj.method;
    switch (method) {
        case (mainPrompt.selection.id):
        case (mainPrompt.selection.firstName):
        case (mainPrompt.selection.lastName):
            const inputObj = await promptUserInput(method);
            viewSelectedEmployee(inputObj);
            break;
        case (mainPrompt.selection.back):
            promptEmployeeMenu();
            break;
        case (mainPrompt.selection.quit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptSelectOneEmployee(employeeIdObjArr) {
    const employeeIdObj = await inquirer.prompt({
        type: 'list',
        message: 'Which employee would you like to edit/delete? (Select Employee ID)',
        name: 'id',
        choices: employeeIdObjArr
    });
    promptEmployeeSelected(employeeIdObj);
};

async function promptEmployeeSelected(employeeIdObj) {
    console.table(await queryFunctions.querySelectedEmployee(employeeIdObj));
    promptFoundEmployee(employeeIdObj);
}

async function promptFoundEmployee(selectedEmployeeIdObj) {
    const selectedMethodObj = await inquirer.prompt(employeePrompt.foundEmployee);
    const method = selectedMethodObj.method;
    switch (method) {
        case (mainPrompt.selection.editEmployee):
            await promptEditEmployee(selectedEmployeeIdObj);
            break;
        case (mainPrompt.selection.deleteEmployee):
            await queryFunctions.deleteEmployee(selectedEmployeeIdObj);
            viewAllEmployee();
            break;
        case (mainPrompt.selection.back):
            promptFindEmployeeMenu();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
    };
};

async function promptEditEmployee(idObj) {
    const selectedEditObj = await inquirer.prompt(employeePrompt.editEmployee);
    const edit = selectedEditObj.edit;
    switch (edit) {
        case (mainPrompt.selection.firstName):
        case (mainPrompt.selection.lastName):
            const newNameObj = await promptUserInput();
            await queryFunctions.updateEmployee(newNameObj, idObj);
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.department):
            const newDepartmentObj = await promptDepartmentSelection();
            const roleObj = await promptDepartmentRolesSelection(newDepartmentObj.name);
            const managerObj = await promptDepartmentManagerSelection(newDepartmentObj.name);
            const updateObj = {
                role_id: roleObj.id,
                manager_id: managerObj.id
            }
            await queryFunctions.updateEmployee(updateObj, idObj);
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.role):
            const employeeDepartmentObj = await queryFunctions.queryEmployeeDepartment(idObj);
            const newRoleObj = await promptDepartmentRolesSelection(employeeDepartmentObj.name);
            await queryFunctions.updateEmployee({role_id: newRoleObj.id}, idObj)
            promptEmployeeSelected(idObj);
            break;

        case (mainPrompt.selection.manager):
            const departmentNameArr = await querySelectedEmployeeDepartments(methodObj);
            const newManagerId = await promptDepartmentManager(departmentNameArr);
            await queryFunctions.updateEmployee({ manager_id: newManagerId }, methodObj);
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



async function promptUserInput(method) {
    let inputObj;
    switch (method) {
        case (mainPrompt.selection.id):
            inputObj = await inquirer.prompt(userInputPrompt.idInupt);
            return inputObj;
        case (mainPrompt.selection.firstName):
            inputObj = await inquirer.prompt(userInputPrompt.firstNameInupt);
            return inputObj;
        case (mainPrompt.selection.lastName):
            inputObj = await inquirer.prompt(userInputPrompt.lastNameInupt);
            return inputObj;
        default:
            break;
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
    console.log('Goodbye!');
    queryFunctions.db.close()
};








init();