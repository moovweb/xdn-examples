"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = install;

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var _child_process = require("child_process");

var _path = require("path");

var _isPackageInstalled = _interopRequireDefault(require("./isPackageInstalled"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Installs packages if they are not already installed.
 * @param {Object} libs The libs to install.  Keys are the names of node packages and values are versions
 * @param {Object} options
 * @param {Object} options.dev If true, the libs will be installed as devDependencies.
 * @return {Promise}
 */
function install(libs, {
  dev = false
} = {}) {
  const toInstall = [],
        packageNames = [];

  for (let lib in libs) {
    if (!(0, _isPackageInstalled.default)(lib)) {
      packageNames.push(lib);
      toInstall.push(`${lib}@${libs[lib]}`);
    }
  }

  if (toInstall.length === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const message = `installing ${_chalk.default.green(packageNames.join(', '))}...`;
    const spinner = (0, _ora.default)(message).start();
    let command;

    if ((0, _fs.existsSync)((0, _path.join)(process.cwd(), 'yarn.lock'))) {
      command = 'yarn add';
      if (dev) command += ' --dev';
    } else {
      command = 'npm install --save';
      if (dev) command += '-dev';
    }

    (0, _child_process.exec)(`${command} ${toInstall.join(' ')}`, error => {
      if (error) {
        spinner.fail(`${message} failed.`);
        console.error(error);
        reject(error);
      } else {
        spinner.succeed(`${message} done.`);
        resolve();
      }
    });
  });
}

module.exports = exports.default;