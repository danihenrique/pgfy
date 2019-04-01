require('dotenv').config();
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const options = require('./configurator');

const { componentsPath } = options.api;
const { servicePath } = options.service;

function main() {
  const CURR_DIR = process.cwd();

  function generateTemplate(templatePath, folderName) {
    const fullTemplatePath = `${__dirname}/${templatePath}`;
    const filesToCreate = fs.readdirSync(fullTemplatePath);
    filesToCreate.forEach((file) => {
      const origFilePath = path.join(fullTemplatePath, file);
      const stats = fs.statSync(origFilePath);
      if (stats.isFile()) {
        const writePath = path.join(CURR_DIR, folderName, file);
        fs.copySync(origFilePath, writePath);
      } else if (stats.isDirectory()) {
        const writePath = path.join(CURR_DIR, folderName, file);
        fs.ensureDirSync(writePath);
        generateTemplate(path.join(templatePath, file), path.join(folderName, file));
      }
    });
  }

  const flow = [
    {
      type: 'list',
      name: 'template',
      message: 'Which template do you want to create?',
      choices: [
        'A new Api component',
        'A new Service',
      ],
    },
    {
      type: 'input',
      name: 'template_name',
      message: 'Type the name',
    },
  ];

  inquirer.prompt(flow)
    .then((answers) => {
      try {
        let importTemplatePath = '';
        let targetFolder = '';
        switch (answers.template) {
          case 'A new Api component':
            importTemplatePath = 'api/common/template/';
            targetFolder = `${componentsPath}/${answers.template_name}`;
            break;
          case 'A new Service':
            importTemplatePath = 'service/common/template/';
            targetFolder = `${servicePath}/${answers.template_name}`;
            break;
          default:
            return;
        }
        generateTemplate(importTemplatePath, targetFolder);
      } catch (e) {
        console.error(e.message);
      }
    });
}

main();
