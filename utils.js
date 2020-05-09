const fs = require("fs");
const gitPullOrClone = require("git-pull-or-clone");

class utils {
  static createDirectoryContents(templatePath, newProjectPath) {
    const CURR_DIR = process.cwd();

    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach((file) => {
      const origFilePath = `${templatePath}/${file}`;

      // get stats about the current file
      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, "utf8");

        const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
        fs.writeFileSync(writePath, contents, "utf8");
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

        // recursive call
        utils.createDirectoryContents(
          `${templatePath}/${file}`,
          `${newProjectPath}/${file}`
        );
      }
    });
  }

  static directoryName(url) {
    return Buffer.from(url).toString("base64").replace("=", "_");
  }

  static gitClone(remoteUrl, outPath) {
    return new Promise((resolve, reject) => {
      try {
        gitPullOrClone(remoteUrl, outPath, (done) => {
          resolve(done);
        });
      } catch (e) {
        reject(e.message);
      }
    });
  }
}

exports.createDirectoryContents = utils.createDirectoryContents;
exports.directoryName = utils.directoryName;
exports.gitClone = utils.gitClone;
