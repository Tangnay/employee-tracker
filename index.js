const inquirer = require("inquirer");
const cTable = require("console.table");

const questions = [
  {
    type: "list",
    name: "option",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Roles",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
  },
];

async function main() {
  const mysql = require("mysql2/promise");
  const db = await mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "12345678",
      database: "employee_tracker_db",
    },
    console.log(`Connected to the employee_tracker_db database.`)
  );

  async function viewAllRoles() {
    const [rows, fields] = await db.query(
      "SELECT role.id as id, title, name as department, salary FROM role JOIN department ON role.department_id = department.id;"
    );
    console.table(rows);
  }

  async function viewAllEmployees() {
    const [rows, fields] = await db.query(
      "SELECT employee.id as id, employee.first_name, employee.last_name, title, department.name as department, salary, CONCAT(e2.first_name,' ', e2.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id Left JOIN employee e2 ON employee.manager_id = e2.id "
    );

    console.table(rows);
  }

  async function viewAllDepartments() {
    const [rows, fields] = await db.query("SELECT * FROM department ");
    console.table(rows);
  }

  async function addRole() {
    const [departments] = await db.query(
      "SELECT id as value, name FROM department"
    );
    const questions = [
      {
        type: "input",
        name: "name",
        message: "what is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "what is the salary of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departments,
      },
    ];

    const answers = await inquirer.prompt(questions);

    await db.query(
      "INSERT INTO role (title, department_id, salary) VALUES (?,?,?)",
      [answers.name, answers.department_id, answers.salary]
    );

    console.log("Added Role to the Database!");
  }

  async function addEmployee() {
    const [roles] = await db.query(
      "SELECT id as value, title as name FROM role"
    );

    const [managers] = await db.query(
      "SELECT id as value, CONCAT(first_name,' ', last_name) as name FROM employee"
    );
    const questions = [
      {
        type: "input",
        name: "firstName",
        message: "what is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "what is the employee's last name?",
      },
      {
        type: "list",
        name: "role_id",
        message: "what is the employee's role?",
        choices: roles,
      },
      {
        type: "list",
        name: "manager_id",
        message: "what is the employee's manager?",
        choices: [{ value: null, name: "None" }, ...managers],
      },
    ];

    const answers = await inquirer.prompt(questions);

    await db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
      [answers.firstName, answers.lastName, answers.role_id, answers.manager_id]
    );

    console.log("Added Employee to the Database!");
  }

  async function updateEmployeeRole() {
    const [roles] = await db.query(
      "SELECT id as value, title as name FROM role"
    );

    const [employees] = await db.query(
      "SELECT id as value, CONCAT(first_name,' ', last_name) as name FROM employee"
    );
    const questions = [
      {
        type: "list",
        name: "employee_id",
        message: "which employee's role do you want to update?",
        choices: employees,
      },
      {
        type: "list",
        name: "role_id",
        message: "which role do you want to assign the selected employee?",
        choices: roles,
      },
    ];

    const answers = await inquirer.prompt(questions);

    await db.query("UPDATE employee SET role_id = ? where id = ?", [
      answers.role_id,
      answers.employee_id,
    ]);

    console.log("Updated Employee in the Database!");
  }

  async function addDepartment() {
    const questions = [
      {
        type: "input",
        name: "name",
        message: "what is the name of the department?",
      },
    ];

    const answers = await inquirer.prompt(questions);

    await db.query("INSERT INTO department (name) VALUES (?)", [answers.name]);

    console.log("Added Department to the Database!");
  }

  async function initOptions() {
    const answers = await inquirer.prompt(questions);
    if (answers.option === "View All Roles") {
      await viewAllRoles();
    } else if (answers.option === "View All Employees") {
      await viewAllEmployees();
    } else if (answers.option === "View All Departments") {
      await viewAllDepartments();
    } else if (answers.option === "Add Role") {
      await addRole();
    } else if (answers.option === "Add Department") {
      await addDepartment();
    } else if (answers.option === "Add Employee") {
      await addEmployee();
    } else if (answers.option === "Update Employee Roles") {
      await updateEmployeeRole();
    }

    initOptions();
  }

  initOptions();
}

main();
