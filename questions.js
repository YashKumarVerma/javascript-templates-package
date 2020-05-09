const fs = require("fs");

const templatesFeedJson = JSON.parse(
  fs.readFileSync(`${__dirname}/templates/source.json`)
).sources;

const choices = templatesFeedJson.map((template) => {
  return {
    name: `${template.author}@ ${template.name}`,
    value: template.repository,
  };
});

const questions = [
  {
    name: "templateUrl",
    type: "list",
    message: "What project template would you like to use?",
    choices: choices,
  },
  {
    name: "projectName",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else {
        return "Project name may only include letters, numbers, underscores and hashes.";
      }
    },
  },
];

exports.questions = questions;
