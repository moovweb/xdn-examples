// This module builds the app for deployment on the Moovweb XDN
const { exec } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { DeploymentBuilder } = require('@xdn/core/deploy');

const appDir = process.cwd();
const builder = new DeploymentBuilder(appDir);

// Copy over static dir to lambda
builder.addJSAsset(join(appDir, 'public', 'static'));
/*
// Create package for external libs
writeFileSync(
  '.xdn/lambda/package.json',
  JSON.stringify({
    dependencies: {
      'next-i18next': 'beta',
      // 'i18next-express-middleware': '^1.9.1',
      // 'i18next-node-fs-backend': '^2.1.3',
      // 'jaeger-client': '^3.17.2',
    },
  })
);
exec('npm install --production', {
  cwd: '.xdn/lambda',
});
*/
