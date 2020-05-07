var _require = require('path'),
    join = _require.join;
/**
 * Ensures that next.config.js exists and sets target: 'serverless'.
 * @param {String} appDir The path to the XDN app's root directory
 */


module.exports = function validateNextConfig(appDir) {
  var nextConfigPath = join(appDir, 'next.config.js');

  var nextConfig = require(nextConfigPath);

  if (typeof nextConfig === 'function') {
    nextConfig = nextConfig(null, {});
  }

  if (nextConfig.target !== 'serverless') {
    console.log('Error: You must set target: "serverless" in next.config.js.  Please update this file and try again.');
    process.exit(1);
  }
};