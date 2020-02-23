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

const mainMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'menuAction',
    choices: [
        'Employee',
        'Department',
        'Role',
        'Exit'
    ]
}

const selection = {
    employee: 'Employee',
    department: 'Department',
    role: 'Role',
    departmentAndRole: 'Department and Role',

    viewAllEmployees: 'View All Employees',
    findEmployee: 'Find Employee(s)',
    addEmployee: 'Add an Employee',

    findEmployee: 'Find Employee(s)',

    id: 'ID',
    firstName: 'First Name',
    lastName: 'Last Name',
    manager: 'Manager',

    editEmployee: 'Edit Employee(s)',
    deleteEmployee: 'Delete Employee(s)',

    viewAllDepartments: 'View All Departments',
    addDepartment: 'Add a Department',
    deleteDepartment: 'Delete a Department',

    back: 'Back',
    exit: 'Exit'
}

module.exports = {
    brand,
    mainMenu,
    selection
}