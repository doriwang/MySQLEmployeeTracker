DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(id),
    department VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(id),
    title VARCHAR(30),
    salary decimal,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(id),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY(role_id) REFERENCES role(id),
    manager_id INT NULL,
    FOREIGN KEY(manager_id) REFERENCES role(id),
    manager VARCHAR	(30)	
);

INSERT INTO department (department)
VALUES ("Sales"), ("Engineering"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Legal Team Lead", 250000, 3), ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id, manager)
VALUES ("John", "Doe", 1, 3, "Ashley Rodriguez"), ("Mike", "Chan", 2, 1, "John Doe"), ("Ashley", "Rodriguez", 3, NULL, NULL), ("Kevin", "Tupik", 4, 3, "Ashley Rodriguez"), ("Sarah", "Lourd", 5, NULL, NULL), ("Tom", "Allen", 6, 5, "Sarah Lourd");

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.id, first_name, last_name, title, department, salary, manager FROM employee LEFT JOIN role ON employee.id = role.id LEFT JOIN department ON department.id = role.department_id;

SELECT first_name, last_name, department FROM employee LEFT JOIN role ON employee.id = role.id LEFT JOIN department ON department.id = role.department_id WHERE department = "sales";

SELECT first_name, last_name, title FROM employee LEFT JOIN role ON employee.id = role.id WHERE title = "sales lead";

SELECT first_name, last_name, manager FROM employee LEFT JOIN role ON employee.id = role.id WHERE manager = "Ashley Rodriguez";

SELECT employee.id, first_name, last_name, title, department, salary, manager FROM employee LEFT JOIN role ON employee.id = role.id LEFT JOIN department ON department.id = role.department_id;

-- BEGIN; INSERT INTO employee (first_name) VALUES ("test"); INSERT INTO role (title) VALUES ("Software Engineer"); COMMIT;