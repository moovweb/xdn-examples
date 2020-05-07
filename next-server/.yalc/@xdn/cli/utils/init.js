"use strict";

const detectFramework = require('../frameworks/detectFramework');

const install = require('../frameworks/install');

const addIgnore = require('./addIgnore');

const get = require('lodash/get');

const resolveInPackage = require('./resolveInPackage');

const logo = require('./logo');

module.exports = async function init({
  context
}) {
  const {
    logger
  } = context;
  const framework = await detectFramework();
  const dependencies = {
    '@xdn/core': 'latest',
    '@xdn/cli': 'latest',
    '@xdn/prefetch': 'latest'
  };

  if (framework) {
    dependencies[framework.builder] = 'latest';

    if (framework.addDependencies) {
      framework.addDependencies.forEach(lib => {
        dependencies[lib] = 'latest';
      });
    }
  }

  await install(dependencies);
  addIgnore();
  const initScript = resolveInPackage(get(framework, 'builder', '@xdn/core'), `bin/init`);
  await require(initScript)();
  logger.title(`\n🎉 Your app is now ready to deploy on the ${logo}!\n`);
};