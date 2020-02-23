const employeeMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'employeeAction',
    choices: [
        'View All Employees',
        'Find Employee(s)',
        'Add an Employee',
        'Back',
        'Exit'
    ]
}

const findEmployee = {
    type: 'list',
    message: 'What would you like to search the employee by?',
    name: 'method',
    choices: [
        'ID',
        'First Name',
        'Last Name',
        'Back',
        'Exit'
    ]
}

const foundEmployee = {
    type: 'list',
    message: 'What would you like to do with the employee(s)?',
    name: 'method',
    choices: [
        'Edit Employee(s)',
        'Delete Employee(s)',
        'Back',
        'Exit'
    ]
}

const editEmployee = {
    type: 'list',
    message: 'What would you like to edit?',
    name: 'edit',
    choices: [
        'First Name',
        'Last Name',
        'Department and Role',
        'Manager',
        'Back',
        'Exit'
    ]
}


module.exports = {
    employeeMenu,
    findEmployee,
    foundEmployee
}