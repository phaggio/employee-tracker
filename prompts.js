const menu = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menuAction',
        choices: [
            'Employee',
            'Department',
            'Exit'
        ]
    }
]

const employee = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'employeeAction',
        choices: [
            'Find an Employee',
            'Add an Employee',
            'Edit an Employee',
            'Delete an Employee',
            'Back',
            'Exit'
        ]
    }
]

const department = [
    {
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
]


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
    menu,
    employee,
    department,
    brand
}