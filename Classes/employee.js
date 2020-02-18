'use strict'

class Employee {
    constructor(firstName, lastName, id, roleId, managerId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.id = id;
        this.roleId = roleId;
        this.managerId = managerId;
    };
};

module.exports = Employee