#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const Spinner = require("cli-spinner").Spinner;
const { questions } = require("./questions");
const { createDirectoryContents, directoryName, gitClone } = require("./utils");

(async function () {
  const spinner = new Spinner("Processing");
  spinner.setSpinnerString(18);

  const answers = await inquirer.prompt(questions);

  const templatePath = `${__dirname}/templates/${directoryName(
    answers.templateUrl
  )}`;

  const templateExists = fs.existsSync(templatePath);
  // wrap everything to avoid expected errors
  try {
    //   check if template already exists in storage dir, if not, download it
    if (templateExists) {
      // tell user that using saved template
      console.log(chalk.green("using cached template"));
    } else {
      // if template not found, get a fresh copy of it
      console.log(chalk.red("Cached template not found, fetching"));

      //   wait till the time it gets cloned
      spinner.start();
      await gitClone(answers.templateUrl, templatePath);
      spinner.stop();
      process.stdout.write("\n");
      //   display success message when cloning complete
      console.log(chalk.green("template downloaded"));
    }

    // now recursively copy the said template to folder from where script called
    const callingDirectory = process.cwd();
    fs.mkdirSync(`${callingDirectory}/${answers.projectName}`);
    createDirectoryContents(templatePath, answers.projectName);
    // catch any error, network or local system
  } catch (e) {
    // display error message if any step breaks
    console.log(chalk.red(e.message));
  }
})();
