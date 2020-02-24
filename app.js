'use strict'

const inquirer = require('inquirer');
const cTable = require('console.table');

const userInputPrompt = require('./assets/prompts/userInputPrompts');
const mainPrompt = require('./assets/prompts/mainPrompts');
const employeePrompt = require('./assets/prompts/employeePrompts');
const departmentPrompt = require('./assets/prompts/departmentPrompts');
const rolePrompt = require('./assets/prompts/rolePrompts');

const queryFunctions = require('./assets/queries/queryFunctions');

const Employee = require('./assets/classes/employee');
const Department = require('./assets/classes/department');
const Role = require('./assets/classes/role');

const init = () => {
    console.log(mainPrompt.brand);
    promptMainMenu();
};

const employeeMenuHeading = () => console.log(`\n---------- Employee Menu ----------\n`);
const departmentMenuHeading = () => console.log(`\n---------- Department Menu ----------\n`);
const roleMenuHeading = () => console.log(`\n---------- Role Menu ----------\n`);

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
            promptRoleMenu();
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
            const newDepartmentObj = await promptUserDepartmentInput();
            const newDepartment = new Department(newDepartmentObj.name);
            await queryFunctions.insertDepartment(newDepartment);
            const newDepartmentIdObjArr = await queryFunctions.queryDepartmentIdByname(newDepartment);
            promptUserRoleInput(newDepartmentIdObjArr[0]);
            break;
        case (mainPrompt.selection.deleteDepartment):
            const departmentObj = await promptDepartmentDeletion();
            if (departmentObj.name === mainPrompt.selection.back) {
                viewAllDepartments();
            }
            await queryFunctions.deleteDepartment(departmentObj);
            viewAllDepartments();
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

async function promptRoleMenu() {
    roleMenuHeading();
    const roleAction = await inquirer.prompt(rolePrompt.roleMenu);
    switch (roleAction.roleAction) {
        case (mainPrompt.selection.viewAllRoles):
            viewAllRoles();
            break;
        case (mainPrompt.selection.deleteRole):
            const roleObj = await promptRoleDeletion();
            if (roleObj.name === mainPrompt.selection.back) {
                viewAllRoles();
                break;
            }
            await queryFunctions.deleteRole(roleObj);
            viewAllRoles();
            break;
        case (mainPrompt.selection.back):
            promptMainMenu();
            break;
        case (mainPrompt.selection.exit):
            goodbye();
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

async function viewAllRoles() {
    const allRoles = await queryFunctions.queryAllRoles();
    console.table(allRoles);
    promptRoleMenu();
};

async function viewSelectedEmployee(inputObj) {
    const selectedEmployeeObj = await queryFunctions.querySelectedEmployee(inputObj);
    console.table(selectedEmployeeObj);
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
            const inputObj = await promptUserEmployeeInput(method);
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
    const selectedEmployeeObj = await queryFunctions.querySelectedEmployee(employeeIdObj);
    console.table(selectedEmployeeObj);
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
    let departmentObj;
    let roleObj;
    let managerObj;
    switch (edit) {
        case (mainPrompt.selection.firstName):
        case (mainPrompt.selection.lastName):
            const newNameObj = await promptUserEmployeeInput();
            await queryFunctions.updateEmployee(newNameObj, idObj);
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.department):
            departmentObj = await promptDepartmentSelection();
            roleObj = await promptDepartmentRolesSelection(departmentObj.name);
            managerObj = await promptDepartmentManagerSelection(departmentObj.name);
            await queryFunctions.updateEmployee({ role_id: roleObj.id, manager_id: managerObj.id }, idObj);
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.role):
            departmentObj = await queryFunctions.queryEmployeeDepartment(idObj);
            roleObj = await promptDepartmentRolesSelection(departmentObj.name);
            await queryFunctions.updateEmployee({ role_id: roleObj.id }, idObj)
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.manager):
            departmentObj = await queryFunctions.queryEmployeeDepartment(idObj);
            managerObj = await promptDepartmentManagerSelection(departmentObj.name);
            await queryFunctions.updateEmployee({ manager_id: managerObj.id }, idObj);
            promptEmployeeSelected(idObj);
            break;
        case (mainPrompt.selection.back):
            promptFoundEmployee(idObj);
            break;
        case (mainPrompt.selection.exit):
            goodbye();
            break;
        default:
            break;
    };
};

async function promptUserEmployeeInput(method) {
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

async function promptUserDepartmentInput() {
    const newDepartmentObj = await inquirer.prompt(userInputPrompt.departmentNameInput);
    return newDepartmentObj;
};

async function promptDepartmentDeletion() {
    let departmentObjArr = await queryFunctions.queryAllDepartments();
    if (!departmentObjArr) {
        departmentObjArr = [];
    };
    departmentObjArr.push({ name: 'Back' });
    const selectedDepartmentObj = await inquirer.prompt({
        type: 'list',
        message: `Which department would you like to remove?`,
        name: 'name',
        choices: departmentObjArr
    });
    for (const departmentObj of departmentObjArr) {
        if (departmentObj.name === selectedDepartmentObj.name) {
            return departmentObj;
        };
    };
};

async function promptUserRoleInput(departmentIdObj) {
    console.log('Please add new role for the department.')
    let addRole = true;
    let newRoleArr = [];
    while (addRole) {
        const newRoleObj = await inquirer.prompt(userInputPrompt.roleInput);
        const newRole = new Role(newRoleObj.title, newRoleObj.salary, departmentIdObj.id);
        newRoleArr.push(newRole);
        const responseObj = await inquirer.prompt({
            type: 'list',
            message: 'Would you like to add more roles?',
            name: 'response',
            choices: [
                'Yes',
                'No'
            ]
        });
        if (responseObj.response === 'No') {
            addRole = false;
        };
    };
    await queryFunctions.insertNewRole(newRoleArr);
    viewAllDepartments();
};

async function promptRoleDeletion() {
    let roleObjArr = await queryFunctions.queryAllRoles();
    if (!roleObjArr) {
        roleObjArr = [];
    };
    roleObjArr.push({ name: 'Back' });
    const selectedRoleObj = await inquirer.prompt({
        type: 'list',
        message: `Which role would you like to remove?`,
        name: 'name',
        choices: roleObjArr
    });
    for (const roleObj of roleObjArr) {
        if (roleObj.name === selectedRoleObj.name) {
            return roleObj;
        };
    };
};

const goodbye = () => {
    console.log('Goodbye!');
    queryFunctions.db.close()
};





init();