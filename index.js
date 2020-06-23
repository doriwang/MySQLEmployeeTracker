const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "none",
    database: "employeeDB",
});
connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log("connected");
    initSearch();
});

let departmentsArry = ["sales", "engineering", "legal"];
let rolesArry = [
    "sales lead", "salesperson", "lead engineer", "software engineer", "legal team lead", "lawyer",
];
let employeesArry = ["john doe", "mike chan", "ashley rodriguez", "kevin tupik", "sarah lourd", "tom allen"]

function initSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All", "View By Category", "Add New Data", "Update Existing Data"],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View All":
                    viewAll();
                    break;

                case "View By Category":
                    viewByCategory();
                    break;

                case "Add New Data":
                    addNewData();
                    break;

                case "Update Existing Data":
                    updateData();
                    break;
            }
        });
}

function viewAll() {
    var query = "SELECT employee.id, first_name, last_name, title, salary, department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id;";

    connection.query(query, function (err, res) {
        if (err) {
            console.log(err)
        }
        console.table('\n', res)
        initSearch()
    })
};

function viewByCategory() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to view by?",
            choices: ["Departments", "Roles", "Employees"],
        })
        .then((answer) => {
            switch (answer.action) {
                case "Departments":
                    viewDepartment();
                    break;

                case "Roles":
                    viewRoles();
                    break;

                case "Employees":
                    viewEmployees();
                    break;
            }
        });
}

function viewDepartment() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) {
            console.log(err);
        }
        console.table("\n", res);
        initSearch();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) {
            console.log(err);
        }
        console.table("\n", res);
        initSearch();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employee;", function (err, res) {
        if (err) {
            console.log(err);
        }
        console.table("\n", res);
        initSearch();
    });
}

function addNewData() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to add?",
            choices: ["New Department", "New Role", "New Employee"],
        })
        .then((answer) => {
            switch (answer.action) {
                case "New Department":
                    addDepartment();
                    break;

                case "New Role":
                    addRole();
                    break;

                case "New Employee":
                    addEmployee();
                    break;
            }
        });
}

function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?",
        })
        .then(function (answer) {
            var dpt = answer.department.toLowerCase();

            if (departmentsArry.includes(dpt)) {
                console.log("Department is already exist");
                initSearch();
            } else {
                console.log("Added New Department");
                departmentsArry.push(dpt);
                connection.query(
                    "INSERT INTO department (department) VALUES (?)",
                    [dpt],
                    function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                initSearch();
            }
        });
}

function addRole() {
    inquirer
        .prompt([{
                name: "role",
                type: "input",
                message: "What role would you like to add?",
            },
            {
                name: "salary",
                type: "input",
                message: "How much is the salary?",
            },
            {
                name: "department_id",
                type: "input",
                message: "What is the department id?",
            },
        ])
        .then(function (answer) {
            var role = answer.role.toLowerCase();

            if (rolesArry.includes(role)) {
                console.log("Role is already exist");
                initSearch();
            } else {
                connection.query(
                    "INSERT INTO role SET ?", {
                        title: role,
                        salary: answer.salary,
                        department_id: answer.department_id,
                    },
                    function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );
                console.log("Added New Role");
                rolesArry.push(role);
                initSearch();
            }
        });
}

function addEmployee() {
    inquirer.prompt([{
            name: "first",
            type: "input",
            message: "What is the employee's first name?"
        }, {
            name: "last",
            type: "input",
            message: "What is the employee's last name?"
        }, {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: rolesArry
        }, {
            name: "role_id",
            type: "input",
            message: "What is the employee's role id?",
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the employee's manager id?",
        }
    ]).then(function (answer) {
        var first = answer.first.toLowerCase();
        var last = answer.last.toLowerCase();
        var nameArry = [first, last].join(" ")
        if (employeesArry.includes(nameArry)) {
            console.log("Employee is already exist");
            initSearch();
        } else {
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: first,
                    last_name: last,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id,
                },
                function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            console.log("Added New Employee");
            employeesArry.push(nameArry);
            initSearch();
        }
    });
}

function updateData() {
    inquirer.prompt([{
            name: "action",
            type: "list",
            message: "What would you like to update?",
            choices: ["Employee Role"],
        },
        {
            name: "employee",
            type: "list",
            message: "Which employee's role would you like to update?",
            choices: employeesArry
        }, {
            name: "role",
            type: "list",
            message: "What is the employee's new role?",
            choices: rolesArry
        }
    ]).then((answer) => {
        var name = answer.employee
        changeRole(name, answer)
        initSearch()
    })
};

function changeRole(name, answer) {
    var first_name = name.split(" ")[0]
    var last_name = name.split(" ")[1]
    var query = "UPDATE employee SET ? WHERE ? AND ?"
    var roleId = 0
    for (var i = 0; i < rolesArry.length; i++) {
        roleId += 1
        switch (answer.role) {
            case rolesArry[i]:
                connection.query(query, [{
                            role_id: roleId,
                        },
                        {
                            first_name: first_name
                        }, {
                            last_name: last_name
                        }
                    ],
                    function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                    }
                )
                break;
        }
    }
}