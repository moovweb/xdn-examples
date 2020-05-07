"use strict";

const detectFramework = require('../frameworks/detectFramework');

const run = require('../utils/run');

const {
  join
} = require('path');

const {
  existsSync
} = require('fs');

const chalk = require('chalk');

const get = require('lodash/get');

const resolveInPackage = require('../utils/resolveInPackage');

exports.command = 'run';
exports.describe = 'Runs your project in local development.';
exports.builder = {
  production: {
    type: 'boolean',
    alias: 'p',
    describe: 'Runs your app in production mode using serverless-offline. This is the best way to simulate the behavior of running your app in the cloud.'
  }
};

exports.handler = async ({
  context,
  production
}) => {
  const framework = await detectFramework();
  const xdnDir = join(process.cwd(), '.xdn');
  const {
    logger
  } = context;
  if (production) process.env.NODE_ENV = 'production';

  if (process.env.NODE_ENV === 'production') {
    if (!existsSync(xdnDir)) {
      logger.error(`\nXDN production build not found. Please run ${chalk.green('xdn build')} before running ${chalk.green('xdn run --production')}.\n`);
      process.exit(1);
    }

    await Promise.all([run(resolveInPackage('serverless', 'bin', 'serverless'), ['offline'], {
      cwd: join(xdnDir, 'lambda')
    }), run('node', [resolveInPackage('@xdn/core', 'bin', 'serveAssets.js')])]);
  } else {
    await run(getNodeCommand(), [resolveInPackage(get(framework, 'builder', '@xdn/core'), 'bin', 'run.js')]);
  }
};
/**
 * Returns babel-node if installed, otherwise node
 */


function getNodeCommand() {
  try {
    return resolveInPackage('@babel/node', 'bin', 'babel-node.js');
  } catch (e) {
    return 'node';
  }
}