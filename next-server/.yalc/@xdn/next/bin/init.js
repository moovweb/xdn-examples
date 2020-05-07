var _require = require('path'),
    join = _require.join;

var _require2 = require('@xdn/core/deploy'),
    DeploymentBuilder = _require2.DeploymentBuilder;

var _require3 = require('@xdn/core/init'),
    addToPackageJson = _require3.addToPackageJson;

var _require4 = require('chalk'),
    cyan = _require4.cyan;
/**
 * Adds all required dependencies and files to the user's app by copying them
 * over from src/default-app.
 */


module.exports = function init() {
  var builder = new DeploymentBuilder(process.cwd());
  builder.addDefaultAppResources(join(__dirname, '..', 'default-app'));
  addToPackageJson({
    scripts: {
      xdn: 'xdn',
      'xdn:start': 'xdn run',
      'xdn:build': 'xdn build',
      'xdn:deploy': 'xdn deploy'
    }
  });
  console.log('');
  console.log('Added the following scripts:');
  console.log('');
  console.log("".concat(cyan('xdn'), " - Run xdn commands using the local version of the XDN CLI."));
  console.log("".concat(cyan('xdn:start'), " - Simulate your app on the XDN locally."));
  console.log("".concat(cyan('xdn:build'), " - Build your app for deployment on the XDN."));
  console.log("".concat(cyan('xdn:deploy'), " - Build and deploy your app on the XDN."));
};