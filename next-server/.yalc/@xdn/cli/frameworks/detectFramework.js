"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detectFramework;

var _frameworks = _interopRequireDefault(require("./frameworks"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detects the framework being used by the project in the current working
 * directory and installs the `xdn-*` library needed to build it for deployment
 * on the XDN, as well as `@xdn/core`.
 * @return {String} The command to run to build the app for deployment on the XDN.
 */
async function detectFramework() {
  const {
    dependencies = {},
    devDependencies = {}
  } = require((0, _path.join)(process.cwd(), 'package.json'));

  const all = Object.keys(dependencies).concat(Object.keys(devDependencies));
  return _frameworks.default.find(framework => all.indexOf(framework.dependency) !== -1);
}

module.exports = exports.default;