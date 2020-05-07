#!/usr/bin/env node
"use strict";

const yargs = require('yargs');

const chalk = require('chalk');

const Context = require('./utils/context');

const isCI = require('is-ci');

const {
  isUserError
} = require('./utils/errors');

const initContext = async argv => {
  const context = new Context(argv);

  if (argv._[0] !== 'build') {
    // Checks the user currently authenticated, with given apiKey
    // or with apiKey saved in configuration.
    await context.checkAuthentication();
  }

  return {
    context
  };
};

yargs.middleware(initContext).commandDir('commands').option('api-url', {
  type: 'string',
  description: 'XDN 2.0 Console URL',
  default: 'https://moovweb.app'
}).options('token', {
  type: 'string',
  description: 'Authenticate with a specific site deploy token.'
}).option('verbose', {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging'
}).options('non-interactive', {
  alias: 'ni',
  type: 'boolean',
  description: 'Runs the command without user interaction. Default to false, except when a known CI env variable is detected',
  default: isCI
}).strict().completion().demandCommand().fail((msg, err, yargs) => {
  try {
    if (err) {
      if (isUserError(err)) {
        console.error(chalk.red.bold(`Error: ${err.message}`));
      } else {
        // Outputs stack trace
        console.error(err);
      }

      return;
    }

    console.log(yargs.help());
    console.log(msg);
  } catch (e) {
    // Any error thrown into fail() callback would be silenced so we make sure
    // nothing pops out
    console.error('Error in .fail():', err);
  } finally {
    process.exit(1);
  }
}).showHelpOnFail(false).argv;