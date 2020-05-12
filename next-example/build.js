// This module builds the app for deployment on the Moovweb XDN
const { exec } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { DeploymentBuilder } = require('@xdn/core/deploy');

const appDir = process.cwd();
const builder = new DeploymentBuilder(appDir);

// Copy over static dir to lambda
builder.addJSAsset(join(appDir, 'public', 'static'), join('public', 'static'));

// Create package for external libs
writeFileSync(
  '.xdn/lambda/package.json',
  JSON.stringify({
    dependencies: {
      'i18next-fs-backend': '^1.0.2',
      'i18next-http-middleware': '^1.0.4',
    },
  })
);
exec('npm install --production', {
  cwd: '.xdn/lambda',
});
