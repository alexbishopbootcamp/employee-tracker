const inquirer = require('inquirer');
const sql = require('mysql2');
const fs = require('fs');

const db = sql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'toor',
    multipleStatements: true, // For parsing the seeds.sql file
  },
  console.log('Connected to database.')
);


// Build template database from seeds.sql
function rebuildDatabase() {
    db.query('DROP DATABASE IF EXISTS employee_db', (err, res) => {
        if (err) throw err;
        console.log('Dropped database employee_db');
    });
    db.query(fs.readFileSync('./seeds.sql').toString(), (err, res) => {
        if (err) throw err;
        console.log('Created tables');
    });
    db.end();
}


rebuildDatabase();