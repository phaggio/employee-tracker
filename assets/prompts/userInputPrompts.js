const idInupt = {
    type: 'input',
    message: `What the employee's ID?`,
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

const departmentNameInput = {
    type: 'input',
    message: `What is the new department name?`,
    name: 'name'
}

const roleInput = [
    {
        type: 'input',
        message: `What is the name of the new role?`,
        name: 'title'
    },
    {
        type: 'input',
        message: `What is the salary of the new role?`,
        name: 'salary'
    }
]

module.exports = {
    idInupt,
    firstNameInupt,
    lastNameInupt,
    departmentNameInput,
    roleInput
}