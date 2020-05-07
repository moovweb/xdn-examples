"use strict";

const init = require('../utils/init');

exports.command = 'init';
exports.describe = 'Adds all required XDN dependencies and files to your app.';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await init({
    context
  });
};