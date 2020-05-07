"use strict";

const os = require('os');

const open = require('open');

const Sockets = require('../utils/sockets');

const loginPrompt = async context => {
  const {
    logger
  } = context;
  logger.title(`Authenticating user!`);
  const name = `CLI Api Key on ${os.hostname()}`;
  const sockets = new Sockets('AuthenticationChannel', context.apiUrl);

  try {
    await sockets.connect();
  } catch (e) {
    logger.error(`Failed to connect to moovweb`);
    process.exit(1);
  }

  return new Promise(resolve => {
    sockets.emit('authorization_init').on('authorization_init', data => {
      const redirectTo = encodeURIComponent(`/account/cli?name=${name}&sid=${data.uuid}`);
      open(`${context.apiUrl}/login?redirectTo=${redirectTo}`, {
        wait: false
      });
    }).on('authorization_token', ({
      api_token,
      email
    }) => {
      context.onLogin(email, api_token);
      logger.success(`🔑 You are now logged in as ${email}${os.EOL}`);
      sockets.close();
      resolve();
    });
  });
};

module.exports = loginPrompt;