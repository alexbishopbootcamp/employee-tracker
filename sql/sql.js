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

module.exports = {
  startup,
  shutdown,
  viewDepartments,
  viewRoles,
  viewEmployees,
};