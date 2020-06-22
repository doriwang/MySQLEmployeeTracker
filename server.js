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
    askingSearch()
});

function askingSearch() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employee By Role",
            "View All Employees By Manager",
            "Add Employee"
        ]
    }).then(answer => {
        switch (answer.action) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Employees By Department":
                employeesByDepartment()
                break;

            case "View All Employees By Role":
                employeesByRole()
                break;

            case "View All Employees By Manager":
                employeesByManager()
                break;

            case "Add Employee":
                addEmployee()
                break;
        }
    })
}

function viewAllEmployees() {
    var query = "SELECT employee.id, first_name, last_name, title, department, salary, manager FROM employee LEFT JOIN role ON employee.id = role.id LEFT JOIN department ON department.id = role.department_id;";

    connection.query(query, function (err, res) {
        if (err) {
            console.log(err)
        }
        console.table('\n', res)
        askingSearch()
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role;", function (err, res) {
        if (err) {
            console.log(err)
        }
        console.table('\n', res)
        askingSearch()
    })
}

function addRoles() {
    var query = "SELECT department.id, department.department FROM department"
    inquirer.prompt(
        // title, salary, department_id
        // grab data as option
        // restart prompt
    )
}

function viewDepartment() {
    connection.query("SELECT * FROM department;", function (err, res) {
        if (err) {
            console.log(err)
        }
        console.table('\n', res)
        askingSearch()
    })
}

function addDepartment() {
    var dpt = "SELECT * FROM department;"
    inquirer.prompt({
        name: "department",
        type: "list",
        message: "Which department would you like to add?",
        choices: [{
            dpt
        }]
    })
    // start here 
    // name of department
    // INSERT QUERY
}



function employeesByDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "Which department?"
    }).then(answer => {
        var query = "SELECT first_name, last_name, department FROM employee LEFT JOIN role ON employee.id = role.id LEFT JOIN department ON department.id = role.department_id WHERE ?"
        connection.query(query, {
            department: answer.department
        }, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.table('\n', res)
            askingSearch()
        })
    })
}

function employeesByRole() {
    inquirer.prompt({
        name: "role",
        type: "input",
        message: "Which role?"
    }).then(answer => {
        var query = "SELECT first_name, last_name, title FROM employee LEFT JOIN role ON employee.id = role.id WHERE ?"
        connection.query(query, {
            title: answer.role
        }, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.table('\n', res)
            askingSearch()
        })
    })
}

function employeesByManager() {
    inquirer.prompt({
        name: "manager",
        type: "input",
        message: "Which manager?"
    }).then(answer => {
        var query = "SELECT first_name, last_name, manager FROM employee LEFT JOIN role ON employee.id = role.id WHERE ?"
        connection.query(query, {
            manager: answer.manager
        }, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.table('\n', res);
            // if (res.length !== null) {
            //     console.log("Manager is not found, try again")
            // }
            askingSearch()
        })
    })
}

async function addEmployee() {
    // var roles = select * role 
    await inquirer.prompt([{
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
        massage: "What is the employee's role?",
        choices: [{

        }]
    }, {
        name: "manager",
        type: "input",
        massage: "What is the employee's manager?"
    }]).then(answer => {
        var query = "INSERT INTO employee SET ?"
        connection.query(query, {
            first_name: answer.first,
            last_name: answer.last,
            // title: answer.role,
            // manager: answer.manager
        }, function (err, res) {
            if (err) {
                console.log(err)
            }
            console.table('\n', res);
            askingSearch()
        })
    })
}


// What would you like to do?


// View All Employees
// View All Employees By Department
// View All Employees By Manager
// View All Employee By Role

// Add Employee
// What is the employee's first name?
// What is the employee's last name?
// What is the employee's role?
// LIST 
// What is the employee's manager?

// Update Employee Manager
// Which employee's manager do you want to update?
// Which employee do you want to set as manager for the selected employee?