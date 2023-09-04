const inquirer = require('inquirer');
//const prompt = require('./prompt.js');
const db = require('./sql/sql.js');

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
}

function exit(){}


const mainMenu = [
  {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: [
      { name: 'View all departments', value: db.viewDepartments },
      { name: 'View all roles', value: db.viewRoles },
      { name: 'View all employees', value: db.viewEmployees },
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

