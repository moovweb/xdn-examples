"use strict";

const build = require('../utils/build');

exports.command = 'build';
exports.describe = 'Builds your project for deployment on the Moovweb XDN.';
exports.builder = {
  skipFramework: {
    type: 'boolean',
    describe: 'Skips running the framework build (Next.js, Vue, Angular, etc...) and uses the existing build instead.'
  }
};

exports.handler = async yargs => {
  await build(yargs);
};