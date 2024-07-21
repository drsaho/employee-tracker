const inquirer = require('inquirer');
const cTable = require('console.table');
const client = require('./connection');

function startApp() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                client.end();
                console.log("Goodbye!");
                break;
        }
    });
}

function viewDepartments() {
    const query = 'SELECT * FROM department';
    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        INNER JOIN department ON role.department_id = department.id
    `;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewEmployees() {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        const checkQuery = 'SELECT * FROM department WHERE name = $1';
        client.query(checkQuery, [answer.name], (err, res) => {
            if (err) throw err;
            if (res.rows.length > 0) {
                console.log('Department already exists.');
                startApp();
            } else {
                const insertQuery = 'INSERT INTO department (name) VALUES ($1)';
                client.query(insertQuery, [answer.name], (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${answer.name} to the database.`);
                    startApp();
                });
            }
        });
    });
}


function addRole() {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary of the role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the role:',
                choices: departments.map(department => ({ name: department.name, value: department.id }))
            }
        ]).then(answers => {
            const checkQuery = 'SELECT * FROM role WHERE title = $1 AND salary = $2 AND department_id = $3';
            client.query(checkQuery, [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) throw err;
                if (res.rows.length > 0) {
                    console.log('Role already exists.');
                    startApp();
                } else {
                    const insertQuery = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
                    client.query(insertQuery, [answers.title, answers.salary, answers.department_id], (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${answers.title} to the database.`);
                        startApp();
                    });
                }
            });
        });
    });
}


function addEmployee() {
    client.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows;
        client.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            const employees = res.rows;
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role for the employee:',
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the manager for the employee:',
                    choices: [{ name: 'None', value: null }].concat(employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })))
                }
            ]).then(answers => {
                // Check for existing employee
                const checkQuery = 'SELECT * FROM employee WHERE first_name = $1 AND last_name = $2 AND role_id = $3 AND manager_id = $4';
                client.query(checkQuery, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                    if (err) throw err;
                    if (res.rows.length > 0) {
                        console.log('Employee already exists.');
                        startApp();
                    } else {
                        const insertQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                        client.query(insertQuery, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);
                            startApp();
                        });
                    }
                });
            });
        });
    });
}


function updateEmployeeRole() {
    client.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows;
        client.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows;
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                }
            ]).then(answers => {
                const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
                client.query(query, [answers.role_id, answers.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Updated employee role.');
                    startApp();
                });
            });
        });
    });
}

startApp();
