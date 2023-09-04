const inquirer = require('inquirer');
const db = require('./sql/sql.js');

async function viewDepartments(){
  const departments = await db.viewDepartments();
  printTable(departments);
}

async function viewRoles(){
  const roles = await db.viewRoles();
  printTable(roles);
}

async function viewEmployees(){
  const employees = await db.viewEmployees();
  printTable(employees);
}

function printTable(data){
  const nullString = 'None'; // String to display if value is null

  // Get max length of each column
  const columnLengths = {};
  for (const row of data){
    for (const [key, value] of Object.entries(row)){
      columnLengths[key] = Math.max(columnLengths[key] || 0,  value ? value.toString().length : nullString.length,  key.length);
    }
  }

  // Print header
  let header = '';
  for (const [key, value] of Object.entries(columnLengths)){
    header += key.padEnd(value) + '   ';
  }
  console.log(header);

  // Print seperator
  let seperator = '';
  for (const [key, value] of Object.entries(columnLengths)){
    seperator += ''.padEnd(value, '-') + '   ';
  }
  console.log(seperator);

  // Print rows
  for (const row of data){
    let line = '';
    for (const [key, value] of Object.entries(row)){
      line += (value ? value.toString().padEnd(columnLengths[key]) : nullString) + '   ';
    }
    console.log(line);
  }

  console.log();
}


async function addDepartment(){
  const addDepartmentMenu = [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
    },
  ];
  
  const departmentInfo = await inquirer.prompt(addDepartmentMenu);
  await db.addDepartment(departmentInfo);
  db.viewDepartments();
}

async function addRole(){
  const departments = await db.getDepartments();
  const addRoleMenu = [
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department does the role belong to?',
      choices: departments,
    },
  ];
  const roleInfo = await inquirer.prompt(addRoleMenu);
  await db.addRole(roleInfo);
  db.viewRoles();
}

async function addEmployee(){
  const employees = await db.getEmployees();
  // Inject a "None" option
  employees.push({ name: 'None', value: null });

  const addEmployeeMenu = [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employee\'s first name?',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employee\'s last name?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the employee\'s role?',
      choices: db.getRoles,
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who is the employee\'s manager?',
      choices: employees,
    },
  ];
  const employeeInfo = await inquirer.prompt(addEmployeeMenu);
  await db.addEmployee(employeeInfo);
  db.viewEmployees();
}

async function updateEmployeeRole(){
  const employees = await db.getEmployees();
  const roles = await db.getRoles();
  const updateEmployeeRoleMenu = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee\'s role would you like to update?',
      choices: employees,
    },
    {
      type: 'list',
      name: 'role',
      message: 'Which role do you want to assign the selected employee?',
      choices: roles,
    },
  ];
  const employeeInfo = await inquirer.prompt(updateEmployeeRoleMenu);
  await db.updateEmployeeRole(employeeInfo);
  db.viewEmployees();
}

function exit(){}


const mainMenu = [
  {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: [
      { name: 'View all departments', value: viewDepartments },
      { name: 'View all roles', value: viewRoles },
      { name: 'View all employees', value: viewEmployees },
      { name: 'Add a department', value: addDepartment },
      { name: 'Add a role', value: addRole },
      { name: 'Add an employee', value: addEmployee },
      { name: 'Update an employee role', value: updateEmployeeRole },
      { name: 'Exit', value: exit },
    ],
  },
];

async function main(){
  await db.startup();

  // Keep looping back to the main menu until user exits
  let selectedAction;
  do {
    selectedAction = (await inquirer.prompt(mainMenu)).mainMenu;
    await selectedAction();
  } while (selectedAction !== exit);

  await db.shutdown();
}

main();

