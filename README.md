# employee-tracker

## Table of contents
- [Overview](#overview)
- [Set Up Instruction](#set-up-instruction)
- [Application Instruction](#application-instruction)
- [Features](#features)
- [Technologies](#technologies)
- [Node.js Modules](#node.js-modules)
- [Future Development](#future-development)
- [Contributing](#contributing)


## Overview
a simple CLI application that manages company's employee relationship and information.


## Set Up Instruction
1. clone this repo to your local hard drive
1. navigate to the repo directory
1. open terminal and install the node module dependencies:

    `npm i`

1. once dependencies are downloaded, run the app:

    `npm run app`

1. open `schema.sql` file and run it.

1. you will need to update the sql connection config for your local host

1. navigate to `./queries/queryFunctions.js`

1. between line 7 - 13, update host ip, port, user, and password for your local sql connection
    <pre><code>
    const sqlConfig = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'employeesDB'
    };</code></pre>



## Application Instruction
1. in the main menu, you can choose what information to view/edit. (Employee, Department, Role)

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/01.png?raw=true" alt="01" width="300"><br>
1. in the employee menu, you can choose to view all employees, find employee to edit/delete, add an employee, go back to previous menu, or exit the app

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/02.png?raw=true" alt="02" width="300"><br>
1. in the employee menu, you can search employee by id, first name, or last name (capitalization matters)

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/03.png?raw=true" alt="03" width="300"><br>
1. in the employee menu, once you enter the search criterion, the app will prompt a list of employees that met your search criterion. You can then select which employee to edit/delete by selecting employee's ID

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/04.png?raw=true" alt="04" width="300"><br>
1. in the employee menu, once you selected which employee to edit/delete, you edit employee's info or delete that employee.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/05.png?raw=true" alt="05" width="300"><br>
1. you can edit employee's first name, last name, department, role, or change manager. Please note that if you choose to edit department, you will also need to edit employee's role and manager.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/06.png?raw=true" alt="06" width="300"><br>
1. Now, if you chose to delete the selected employee, that employee will be deleted from the database, app will display a view all of all employees, and you will be redirected back to employee menu

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/07.png?raw=true" alt="07" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/08.png?raw=true" alt="08" width="300"><br>
1. in the employee menu, you can choose "Add an Employee" to add a new employee to the database

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/09.png?raw=true" alt="09" width="300">

1. you will be prompted for the new employee's first name, last name, department, role, and manager.

1. provide new employee's information.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/10.png?raw=true" alt="10" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/11.png?raw=true" alt="11" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/12.png?raw=true" alt="12" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/13.png?raw=true" alt="13" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/14.png?raw=true" alt="14" width="300"><br>

1. once you submit new employee's info, you will be redirected to employee menu. Now you can select "Back" to go back to main menu

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/15.png?raw=true" alt="15" width="300"><br>
1. in the main menu, select "Department" to access department functions

1. in the department menu, select "View All Departments" to view all departments currently in the database

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/16.png?raw=true" alt="16" width="300"><br>
1. in the department menu, select "Add a new Department" to add a new department to the database. Please note that if you add a new department, you will also need to add new roles in the department.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/17.png?raw=true" alt="17" width="300"><br>
1. you'll be prompted for new department name

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/18.png?raw=true" alt="18" width="300"><br>
1. you'll also need to enter info for the new roles in the department.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/19.png?raw=true" alt="19" width="300"><br>
    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/20.png?raw=true" alt="20" width="300"><br>
1. then you'll be redirected back to department menu

1. in the department menu, choose "Delete a Department" to remove a department from the database.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/21.png?raw=true" alt="21" width="300"><br>
1. once you delete a department, it is gone from the department table. Employee's role will not change, and now they may not have a department name.

1. select back to go back to main menu

1. in the main menu, select "Role" to see role functions 

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/22.png?raw=true" alt="22" width="300"><br>
1. in the role menu, click on "View All Roles" to view all roles currently in the database

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/23.png?raw=true" alt="23" width="300"><br>
1. in the role menu, click on "Delete a Role" to select a role and remove it from the database. Please note that employee's role id will not change, and now they may not have a title.

    <img src="https://github.com/phaggio/employee-tracker/blob/master/images/24.png?raw=true" alt="24" width="300"><br>


## Features
* application's sql queries and query related functions, menu prompt copies, and classes are all in separate directory and modules
* application will prompt relevant data with respect to user's input (e.g. when adding a new employee, specific roles are prompted for user's selection, depending what user chose for new employee's department earlier, etc.)
* application will prompt additional data request depending what new info user is adding. (e.g. when adding a new department, user is required to add at least one role info for that new department, etc.)


## Technologies
* Javascript


## Node.js Modules
* console.table
* inquirer
* mysql

## Future Development
* user input validation
* add new roles to existing department
* edit existing roles
* additional function to aggregate employee data

## Contributing
If you like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

