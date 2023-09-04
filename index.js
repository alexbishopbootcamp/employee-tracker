const inquirer = require('inquirer');
//const prompt = require('./prompt.js');
const sql = require('./sql/sql.js');

function addDepartment(){}
function addRole(){}
function addEmployee(){}
function updateEmployeeRole(){}
function exit(){}


const mainMenu = [
  {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: [
      { name: 'View all departments', value: sql.viewDepartments },
      { name: 'View all roles', value: sql.viewRoles },
      { name: 'View all employees', value: sql.viewEmployees },
      { name: 'Add a department', value: addDepartment },
      { name: 'Add a role', value: addRole },
      { name: 'Add an employee', value: addEmployee },
      { name: 'Update an employee role', value: updateEmployeeRole },
      { name: 'Exit', value: exit },
    ],
  },
];


async function main(){
  await sql.startup();

  let selectedAction;
  do {
    selectedAction = (await inquirer.prompt(mainMenu)).mainMenu;
    await selectedAction();
  } while (selectedAction !== exit);

  await sql.shutdown();
}

main();

