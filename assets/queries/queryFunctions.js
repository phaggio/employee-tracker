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


module.exports = {
    db,
    queryAllEmployees
}