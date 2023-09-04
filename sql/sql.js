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
function rebuildDatabase(){
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

function startup(){

  // Check if employee_db exists, rebuild if necessary
  db.query('SHOW DATABASES', (err, res) => {
    if (err) throw err;
    if (res.some(entry => entry.Database === 'employee_db')) {
      console.log('Database employee_db exists');
    } else {
      console.log('Database employee_db does not exist');
      rebuildDatabase();
    }
  });

  db.query('USE employee_db', (err, res) => {
    if (err) throw err;
    console.log('Using employee_db');
  });
}

function shutdown(){
  db.end();
  console.log('Disconnected from database.');
}

module.exports = {
  startup,
  shutdown,
};