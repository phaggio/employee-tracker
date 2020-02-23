DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT
    , name VARCHAR(30) NULL
    
    , PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT
    , title VARCHAR(30) NULL
    , salary DECIMAL(10, 2) NULL 
    , department_id INT NULL
    
    , PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT
    , first_name VARCHAR(30) NULL
    , last_name VARCHAR(30) NULL
    , role_id INT NULL
    , manager_id INT NULL
    
    , PRIMARY KEY (id)
    , FOREIGN KEY (role_id) REFERENCES role(id)
);

-- update all department data
INSERT INTO department (name)
VALUES ('Finance'), ('Engineering'), ('Marketing');

-- update all roles data
INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 150000, 1), ('Sr. Analyst', 100000, 1), ('Analyst', 80000, 1)
	,('Manager', 200000, 2), ('Sr. Software Engineer', 150000, 2), ('Software Engineer', 100000, 2)
    ,('Manager', 130000, 3), ('Channel Manager', 90000, 3), ('Marketing Specialist', 70000, 3);

-- insert sample employee data
INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Jeff', 'Bezos', 1), ('Bill', 'Gates', 7);

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;

SELECT
	concat(e.first_name, ' ', e.last_name) as name
    , e.id
FROM 
	employee e
	join role r
	on e.role_id = r.id
	join department d
	on r.department_id = d.id
WHERE d.name = 'Engineering' and r.title = 'Manager'
;

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
    on r.department_id = d.id;
    
SELECT
	id
FROM
	department
WHERE
	name = 'Engineering';
    
    
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
    ) a;
    


SELECT DISTINCT
	d.name as department_name
FROM
	(
	SELECT role_id
	FROM employee
	WHERE first_name = 'Richard'
	) a
	JOIN role r
	on a.role_id = r.id
	JOIN department d
	on r.department_id = d.id
;