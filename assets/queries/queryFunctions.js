'use strict';

const mysql = require('mysql');
const util = require('util');
const query = require('./queries');

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


async function queryAllEmployees() {
    try {
        return db.query(query.viewAllEmployees);
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

async function queryAllRoles() {
    try {
        return await db.query(query.viewAllRoles);
    } catch (err) {
        console.error(err);
    };
}

async function queryRolesByDepartment(departmentName) {
    try {
        const roleObjArr = await db.query(query.getDepartmentRoles, departmentName);
        return roleObjArr;
    } catch (err) {
        console.error(err);
    };
};

async function queryDepartmentManager(departmentName) {
    try {
        const managerObjArr = await db.query(query.getDepartmentManager, departmentName);
        return managerObjArr;
    } catch (err) {
        console.error(err);
    };
};

async function queryEmployeeDepartment(methodObj) {
    try {
        let departmentObjArr = await db.query(query.findEmployeeDepartment, methodObj);
        if (!departmentObjArr) {
            console.error('No department found!')
        } else {
            return departmentObjArr[0];
        };
    } catch (err) {
        console.error(err);
    };
};

async function queryEmployeeId(inputObj) {
    try {
        const idObjArr = await db.query(query.findEmployeeId, inputObj);
        let idArr = [];
        for (const obj of idObjArr) {
            idArr.push(obj.id);
        }
        // return an array of employee IDs
        return idArr;
    } catch (err) {
        console.error(err)
    };
};

async function querySelectedEmployee(methodObj) {
    try {
        return await db.query(query.findEmployee, methodObj);
    } catch (err) {
        console.error(err);
    };
};

async function insertEmployee(Employee) {
    try {
        db.query(query.insertEmployee, Employee);
    } catch (err) {
        console.error(err);
    };
    return;
};

async function updateEmployee(updateObj, whereObj) {
    try {
        await db.query(query.updateEmployee, [updateObj, whereObj]);
        console.log(`\nEmployee Updated!\n`)
    } catch (err) {
        console.error(err);
    };
    return;
};

async function deleteEmployee(idObj) {
    try {
        await db.query(query.deleteEmployee, idObj);
        console.log(`\nEmployee Deleted!\n`);
    } catch (err) {
        console.error(err);
    };
    return;
};


async function insertDepartment(Department) {
    try {
        db.query(query.insertDepartment, Department);
    } catch (err) {
        console.error(err);
    };
};

async function deleteDepartment(departmentObj) {
    try {
        db.query(query.deleteDepartment, departmentObj.id);
    } catch (err) {
        console.error(err);
    };
};

async function queryDepartmentIdByname(departmentNameObj) {
    try {
        return await db.query(query.getDepartmentIdByDepartmentName, departmentNameObj);
    } catch (err) {
        console.error(err);
    }
}

async function insertNewRole(newRoleArr) {
    if (!newRoleArr) {
        return;
    };
    for (const role of newRoleArr) {
        try {
            await db.query(query.insertRoles, role);
            console.log(`inserted ${role.title}`)
        } catch (err) {
            console.error(err);
        };
    };
};

async function deleteRole(roleObj) {
    try {
        db.query(query.deleteRole, roleObj.id);
    } catch (err) {
        console.error(err);
    };
};


module.exports = {
    db,

    queryAllEmployees,
    queryAllDepartments,
    queryAllRoles,
    
    querySelectedEmployee,
    queryDepartmentManager,
    queryRolesByDepartment,

    queryEmployeeId,
    queryEmployeeDepartment,

    insertEmployee,
    updateEmployee,
    deleteEmployee,

    insertDepartment,
    queryDepartmentIdByname,
    deleteDepartment,

    insertNewRole,
    deleteRole
    
}