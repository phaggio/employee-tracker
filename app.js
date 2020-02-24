'use strict'

const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const cTable = require('console.table');
const clear = require('clear');

const userInputPrompt = require('./assets/prompts/userInputPrompts');
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

init();

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

async function viewSelectedEmployee(inputObj) {
    const selectedEmployeeObjArr = await queryFunctions.querySelectedEmployee(inputObj);
    console.table(selectedEmployeeObjArr);
    const selectedIdObjArr = await queryFunctions.queryEmployeeId(inputObj);
    promptSelectOneEmployee(selectedIdObjArr);
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

async function promptDepartmentRolesSelection(department) {
    const roleObjArr = await queryFunctions.queryRolesByDepartment(department);
    const selectedRoleObj = await inquirer.prompt({
        type: 'list',
        message: `What is employee's role?`,
        name: 'name',
        choices: rolesObj
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
    let managerNameArr = ['None'];
    try {
        const managerObjArr = await queryFunctions.queryDepartmentManager(departmentName);
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
        // return manager's employee ID
        console.log(selectedManager);
        return selectedManager[0];
    } catch (err) {
        console.error(err)
    };
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
    const selectedEmployeeIdObj = await inquirer.prompt({
        type: 'list',
        message: 'Which employee would you like to edit/delete? (Select Employee ID)',
        name: 'id',
        choices: employeeIdObjArr
    });
    // show the selected one employee info.
    console.table(await queryFunctions.querySelectedEmployee(selectedEmployeeIdObj));
    promptFoundEmployee(selectedEmployeeIdObj);
};

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
            await updateEmployee(newNameObj, idObj);
            promptFoundEmployee(idObj);
            break;
        case (mainPrompt.selection.department):
            // need to get manager obj with id
            const newDepartmentObj = await promptDepartmentSelection();
            const newRoleObj = await promptDepartmentRolesSelection(newDepartmentObj.name);
            const newManagerObj = await promptDepartmentManagerSelection(newDepartmentObj.name);

            const updateObj = {
                role_id: newRoleObj.id,
                manager_id: newManagerObj.id
            }
            await updateEmployee(updateObj, idObj);
            promptFoundEmployee(idObj);
            break;
        // case (mainPrompt.selection.department):

        //     const newDepartmentObj = await promptDepartmentSelection();
        //     const newRoleObj = await promptDepartmentRolesSelection(newDepartmentObj.name);

        //     const departmentId = await getDepartmentIdByDepartmentName(newDepartmentObj.name);
        //     const roleId = await getRoleIdByTitleAndDepartment(newRoleName, departmentId);

        //     const managerId = await promptDepartmentManager(newDepartmentName);

        //     await updateEmployee({ role_id: roleId, manager_id: managerId }, methodObj);
        //     viewSelectedEmployee(methodObj);
        //     break;
        case (mainPrompt.selection.manager):
            const departmentNameArr = await querySelectedEmployeeDepartments(methodObj);
            const newManagerId = await promptDepartmentManager(departmentNameArr);
            await updateEmployee({ manager_id: newManagerId }, methodObj);
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


async function querySelectedEmployeeDepartments(methodObj) {
    try {
        const departmentObjArr = await db.query(query.findEmployeeDepartments, methodObj);
        let departmentNameArr = [];
        for (const obj of departmentObjArr) {
            departmentNameArr.push(obj.name);
        }
        return departmentNameArr;
    } catch (err) {
        console.error(err);
    };
};



async function insertNewEmployee(Employee) {
    try {
        db.query(query.insertEmployee, Employee);
    } catch (err) {
        console.error(err);
    };
    return;
};

// async function updateEmployee(updateObj, whereObj) {
//     console.log(updateObj);
//     try {
//         await db.query(query.updateEmployee, [updateObj, whereObj]);
//         console.log(`\nEmployee(s) Updated!\n`)
//     } catch (err) {
//         console.error(err);
//     };
//     return;
// };

// async function deleteEmployee(idObj) {
//     try {
//         await db.query(query.deleteEmployee, idObj);
//         console.log(`\nEmployee(s) Deleted!\n`);
//     } catch (err) {
//         console.error(err);
//     };
//     return;
// };


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

