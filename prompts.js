const brand = `
 -------------------------------------------------------------------------------------------------
      ______                __                         ______                __            
     / ____/___ ___  ____  / /___  __  _____  ___     /_  __/________ ______/ /_____  _____
    / __/ / __ '__ \\/ __ \\/ / __ \\/ / / / _ \\/ _ \\     / / / ___/ __ '/ ___/ //_/ _ \\/ ___/
   / /___/ / / / / / /_/ / / /_/ / /_/ /  __/  __/    / / / /  / /_/ / /__/ ,< /  __/ /    
  /_____/_/ /_/ /_/ .___/_/\\____/\\__, /\\___/\\___/    /_/ /_/   \\__,_/\\___/_/|_|\\___/_/     
                 /_/            /____/                                                     
 -------------------------------------------------------------------------------------------------
`

const prompts = {
    employee: 'Employee',
    department: 'Department',
    viewAllEmployee: 'View All Employees',
    addEmployee: 'Add an Employee',

    findEmployee: 'Find an Employee',
    id: 'ID',
    firstName: 'First Name',
    lastName: 'Last Name',

    editEmployee: 'Edit an Employee',
    deleteEmployee: 'Delete an Employee',

    viewDepartment: 'View All Departments',
    addDepartment: 'Add a Department',
    deleteDepartment: 'Delete a Department',

    back: 'Back',
    exit: 'Exit'
}

const mainMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menuAction',
    choices: [
        'Employee',
        'Department',
        'Exit'
    ]
}

const employeeMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'employeeAction',
    choices: [
        'View All Employees',
        'Find an Employee',
        'Add an Employee',
        'Back',
        'Exit'
    ]
}

const departmentMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'departmentAction',
    choices: [
        'View All Departments',
        'Add a Department',
        'Delete a Department',
        'Back',
        'Exit'
    ]
}

const addEmployee = [
    {
        type: 'input',
        message: `What is employee's first name?`,
        name: `firstName`
    },
    {
        type: 'input',
        message: `What is employee's last name?`,
        name: `lastName`
    }
]

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

const idInupt = {
    type: 'input',
    message: `What is employee's ID?`,
    name: 'id'
}

const firstNameInupt = {
    type: 'input',
    message: `What is employee's first name?`,
    name: 'first_name'
}

const lastNameInupt = {
    type: 'input',
    message: `What is employee's last name?`,
    name: 'last_name'
}


module.exports = {
    brand,
    prompts,
    mainMenu,
    employeeMenu,
    departmentMenu,
    addEmployee,
    findEmployee,
    idInupt,
    firstNameInupt,
    lastNameInupt

}