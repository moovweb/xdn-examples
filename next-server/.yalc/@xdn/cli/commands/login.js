"use strict";

const loginPrompt = require('../prompts/login');

exports.command = 'login';
exports.describe = 'Logs you into the Moovweb XDN';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await loginPrompt(context);
};