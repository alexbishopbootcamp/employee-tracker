const sql = require('mysql2/promise');
const fs = require('fs');

let db;

// Build template database from seeds.sql
async function rebuildDatabase(){
    await db.query('DROP DATABASE IF EXISTS employee_db');
    await db.query(fs.readFileSync('./sql/seeds.sql').toString());
}

async function startup(){
  // Connect to database
  console.log('Connecting to database...')
  db = await sql.createConnection(
    {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'toor',
      multipleStatements: true, // For parsing the seeds.sql file
    }
  );

  console.log('Connected.')

  // Check if employee_db exists, rebuild if necessary
  const [rows, fields]  = await db.query('SHOW DATABASES');
  
  if (!rows.some(entry => entry.Database === 'employee_db')) {
    console.log('Database not found. Rebuilding from template...');
    await rebuildDatabase();
  }

  await db.query('USE employee_db');
}

async function shutdown(){
  await db.end();
  printTable('Disconnected from database.');
}

async function viewDepartments(){
  const [rows, fields] = await db.query('SELECT * FROM department');
  return(rows);
}

async function viewRoles(){
  const [rows, fields] = await db.query(`
    SELECT 
      r.id AS RoleID, 
      r.title AS Title, 
      r.salary AS Salary, 
      d.name AS Department
    FROM role r
    LEFT JOIN department d ON r.department_id = d.id
  `);
  return(rows);
}

// View employees with their roles, salaries, departments, and managers
async function viewEmployees(){
  const [rows, fields] = await db.query(`
    SELECT 
      e.id AS EmployeeID, 
      CONCAT(e.first_name, ' ', e.last_name) AS Name,
      r.title AS Title, 
      r.salary AS Salary, 
      d.name AS Department, 
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `);
  return(rows);
}

async function getDepartments(){
  const [rows, fields] = await db.query('SELECT * FROM department');
  return rows.map(row => ({ name: row.name, value: row.id }));
}

async function getRoles(){
  const [rows, fields] = await db.query('SELECT * FROM role');
  return rows.map(row => ({ name: row.title, value: row.id }));
}

async function getEmployees(){
  const [rows, fields] = await db.query('SELECT * FROM employee');
  return rows.map(row => ({ name: row.first_name + ' ' + row.last_name, value: row.id }));
}

async function addDepartment(departmentInfo){
  await db.query('INSERT INTO department (name) VALUES (?)', [departmentInfo.name]);
}

async function addRole(roleInfo){
  await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleInfo.title, roleInfo.salary, roleInfo.department]);
}

async function addEmployee(employeeInfo){
  await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeInfo.firstName, employeeInfo.lastName, employeeInfo.role, employeeInfo.manager]);
}

async function updateEmployeeRole(employeeInfo){
  await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [employeeInfo.role, employeeInfo.employee]);
}

module.exports = {
  startup,
  shutdown,
  viewDepartments,
  viewRoles,
  viewEmployees,
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};