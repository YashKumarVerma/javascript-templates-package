#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const Spinner = require("cli-spinner").Spinner;
const { questions } = require("./questions");
const { createDirectoryContents, directoryName, gitClone } = require("./utils");
const homedir = require("os").homedir();

/**
 * @description function to execute the bundle in a synchronous manner
 */
(async function () {
  // load a new spinner with text:processing, style type 18. Check docs for more
  const spinner = new Spinner("Processing");
  spinner.setSpinnerString(18);

  //   load inquirer questions module with templates data
  const answers = await inquirer.prompt(questions);

  //   generate a unique template path to avoid collisions and enable local caching
  const templatePath = `${homedir}/.javascript-templates/templates/${directoryName(
    answers.templateUrl
  )}`;

  //   check if local cached version exists
  const templateExists = fs.existsSync(templatePath);

  //   lots of fs, so lots of errors to expect
  try {
    // if local copy of templates exist, display message
    if (templateExists) {
      console.log(chalk.green("using cached template"));
    } else {
      // if local copy of template does not exist, display message
      console.log(chalk.red("Cached template not found, fetching"));

      //   ensure that storage directories exist, if not, create them
      if (!fs.existsSync(`${homedir}/.javascript-templates`)) {
        fs.mkdirSync(`${homedir}/.javascript-templates`);
        fs.mkdirSync(`${homedir}/.javascript-templates/templates`);
      }

      //   start showing spinner before template cloning starts
      spinner.start();

      //   wait for script to clone the repository to required directory
      await gitClone(answers.templateUrl, templatePath);

      //   when cloning ends, stop the spinner
      spinner.stop();

      //   give an extra line to prevent text in same line as spinner text
      process.stdout.write("\n");

      //   display success message to user
      console.log(chalk.green("template downloaded"));
    }

    // now recursively copy the said template to folder from where script called
    const callingDirectory = process.cwd();
    fs.mkdirSync(`${callingDirectory}/${answers.projectName}`);
    createDirectoryContents(templatePath, answers.projectName);
  } catch (e) {
    // catch any error, network or local system
    console.log(chalk.red(e.message));
  }
})();
