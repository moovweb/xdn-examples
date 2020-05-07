"use strict";

const authenticate = require('../prompts/authenticate');

exports.command = 'whoami';
exports.describe = 'Returns the current account email';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await authenticate(context);
};