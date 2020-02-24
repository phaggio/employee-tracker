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

-- add sample department data
INSERT INTO department (name)
VALUES ('Finance'), ('Engineering'), ('Marketing');

-- add sample roles data
INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 150000, 1), ('Sr. Analyst', 100000, 1), ('Analyst', 80000, 1)
	,('Manager', 200000, 2), ('Sr. Software Engineer', 150000, 2), ('Software Engineer', 100000, 2)
    ,('Manager', 130000, 3), ('Channel Manager', 90000, 3), ('Marketing Specialist', 70000, 3);

-- add sample employee data
INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Jeff', 'Bezos', 1), ('Bill', 'Gates', 7), ('Michael', 'Jordan', 4), ('Richard', 'Wang', 5);
