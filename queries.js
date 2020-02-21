'use strict'

const viewAllEmployees = `
SELECT
	e.id as 'ID'
    , e.first_name as 'First Name'
    , e.last_name as 'Last Name'
    , r.title as 'Title'
    , r.salary as 'Salary'
    , d.name as 'Department'
FROM
	employee e
    join role r
    on e.role_id = r.id
    join department d
    on r.department_id = d.id
;`

const getDepartmentId = `
SELECT
	id
FROM
	department
WHERE
    ?;
`

const getRoleId = `
SELECT
    id
FROM
    role
WHERE
    ?;
`

const findDepartmentManagerQuery = `
SELECT 
    concat(e.first_name, ' ', e.last_name) as name
    , e.id
FROM 
    employee e 
    join role r 
    on e.role_id = r.id 
    join department d 
    on r.department_id = d.id 
WHERE 
    d.name = ? and r.title = 'Manager'
;`

const addEmployee = `
INSERT INTO employee
SET ?
`

module.exports = {
    viewAllEmployees,
    getDepartmentId,
    getRoleId,
    findDepartmentManagerQuery,
    addEmployee
}