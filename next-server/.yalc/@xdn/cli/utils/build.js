"use strict";

const detectFramework = require('../frameworks/detectFramework');

const get = require('lodash/get');

const resolveInPackage = require('./resolveInPackage');

const logo = require('./logo');

module.exports = async function build({
  context,
  skipFramework
}) {
  const {
    logger
  } = context;
  logger.title(`🛠️ Building your app for deployment on the ${logo}\n`);
  const framework = await detectFramework();
  const builderPackage = get(framework, 'builder', '@xdn/core');
  const builderModule = resolveInPackage(builderPackage);

  const build = require(`${builderModule}/bin/build`);

  await build({
    skipFramework
  });
};