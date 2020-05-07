"use strict";

exports.command = 'logout';
exports.describe = 'Clears authentication';
exports.builder = {};

exports.handler = async ({
  context
}) => {
  await context.logout();
};