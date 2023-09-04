const inquirer = require('inquirer');
const sql = require('./sql/sql.js');


function app(){
  sql.startup();
}

app();