'use strict'

const viewAllEmployees = `
SELECT
	e.id as 'ID'
    , e.first_name as 'First Name'
    , e.last_name as 'Last Name'
    , r.title as 'Title'
    , r.salary as 'Salary'
    , d.name as 'Department'
    , case when m.last_name is null then ''
        else m.id end as 'Manager ID'
    , case when m.last_name is null then ''
        else concat(m.first_name, ' ', m.last_name) end as 'Manager'
FROM
	employee e
    join role r
    on e.role_id = r.id
    join department d
    on r.department_id = d.id
    left join employee m
    on e.manager_id = m.id
;`

const getAllDepartments = `
SELECT *
FROM department
;`

const getDepartmentRoles = `
SELECT
    r.id as id
    , r.title as name
FROM
    department d
    join role r
    on d.id = r.department_id
WHERE
    d.name = ?
;`

const getDepartmentManager = `
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


// const getRoleIdByTitleAndDepartment = `
// SELECT
//     id
// FROM
//     role
// WHERE
//     title = ?
//     AND department_id = ?
// ;`



const findEmployeeDepartment = `
SELECT DISTINCT
    d.id
	, d.name as name
FROM
	(
	SELECT role_id
	FROM employee
	WHERE ?
	) a
	JOIN role r
	on a.role_id = r.id
	JOIN department d
	on r.department_id = d.id
;`

const insertEmployee = `
INSERT INTO employee
SET ?
;`


const findEmployee = `
SELECT
    id as ID
    , first_name as 'First Name'
    , last_name as 'Last Name'
    , title as 'Title'
    , salary as 'Salary'
    , department as 'Department'
    , manager as 'Manager'
FROM
    (
    SELECT
        e.id
        , e.first_name
        , e.last_name
        , r.title
        , r.salary
        , d.name as department
        , case when m.last_name is null then ''
            else concat(m.first_name, ' ', m.last_name) end as 'manager'
    FROM
        employee e
        join role r
        on e.role_id = r.id
        join department d
        on r.department_id = d.id
        left join employee m
        on e.manager_id = m.id
    ) a
WHERE
    ?
;`

const updateEmployee = `
UPDATE employee
SET ?
WHERE ?
;`

const deleteEmployee = `
DELETE FROM employee WHERE ?;
`

const findEmployeeId = `
SELECT
    id
FROM
    (
    SELECT
        e.id
        , e.first_name
        , e.last_name
        , r.title
        , r.salary
        , d.name as department
        , case when m.last_name is null then ''
            else concat(m.first_name, ' ', m.last_name) end as 'manager'
    FROM
        employee e
        join role r
        on e.role_id = r.id
        join department d
        on r.department_id = d.id
        left join employee m
        on e.manager_id = m.id
    ) a
WHERE
    ?
;`


const insertDepartment = `
INSERT INTO department
SET ?
;`

const getDepartmentIdByDepartmentName = `
SELECT
	id
FROM
	department
WHERE
    ?
;`

const deleteDepartment = `
DELETE FROM department WHERE id = ?
;`

const insertRoles = `
INSERT INTO role
SET ?
;`


module.exports = {
    viewAllEmployees,

    getAllDepartments,
    getDepartmentRoles,
    
    
    // getRoleIdByTitleAndDepartment,

    getDepartmentManager,
    findEmployeeDepartment,

    insertEmployee,
    findEmployee,
    updateEmployee,
    deleteEmployee,
    findEmployeeId,

    insertDepartment,
    getDepartmentIdByDepartmentName,
    deleteDepartment,

    insertRoles
};