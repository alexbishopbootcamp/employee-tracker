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
  printTable(rows);
}

async function viewRoles(){
  const [rows, fields] = await db.query('SELECT * FROM role');
  printTable(rows);
}

async function viewEmployees(){
  const [rows, fields] = await db.query('SELECT * FROM employee');
  printTable(rows);
}

// Example data:
// [
//   { id: 1, name: 'Sales' },
//   { id: 2, name: 'Engineering' },
//   { id: 3, name: 'Finance' },
//   { id: 4, name: 'Legal' }
// ]

// Do this properly later
function printTable(data){
  console.table(data);
}

// Get a list of departments and their IDs. Example:
// [
//   { id: 1, name: 'Sales' },
//   { id: 2, name: 'Engineering' },
//]
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
  await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [employeeInfo.role, employeeInfo.id]);
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