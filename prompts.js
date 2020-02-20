const prompts = {
    employee: 'Employee',
    department: 'Department',
    viewAllEmployee: 'View All Employees',
    findEmployee: 'Find an Employee',
    addEmployee: 'Add an Employee',
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
        'Edit an Employee',
        'Delete an Employee',
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

const employee = [
    {
        type: 'input',
        message: `What is employee's first name?`,
        name: `firstName`
    },
    {
        type: 'input',
        message: `What is employee's last name?`,
        name: `lastName`
    },
    {
        type: 'list',
        message: `What is employee's department?`,
        name: `department`,
        choices: [
            `Finance`,
            `Engineering`,
            `Marketing`
        ]
    }
]

const role = {
    finance: {
        type: 'list',
        message: `What is employee's role?`,
        name: `role`,
        choices: [
            `Manager`,
            `Sr. Analyst`,
            `Analyst`
        ]
    },
    engineering: {
        type: 'list',
        message: `What is employee's role?`,
        name: `role`,
        choices: [
            `Manager`,
            `Sr. Software Engineer`,
            `Software Engineer`
        ]
    },
    marketing: {
        type: 'list',
        message: `What is employee's role?`,
        name: `role`,
        choices: [
            `Manager`,
            `Channel Manager`,
            `Marketing Specialist`
        ]
    }
}


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

module.exports = {
    prompts,
    mainMenu,
    employeeMenu,
    departmentMenu,
    brand,
    employee,
    role
}