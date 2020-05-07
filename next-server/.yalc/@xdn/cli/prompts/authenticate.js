"use strict";

const prompts = require('../utils/prompts');

const loginPrompt = require('./login');

const authenticationStatus = require('./authenticationStatus');

const {
  AuthenticationError
} = require('../utils/errors');

const authenticatePrompt = async context => {
  const {
    value
  } = await prompts({
    type: 'select',
    name: 'value',
    message: `Let's get you signed-in, your browser will open on ${context.apiUrl}.`,
    choices: [{
      title: 'Continue',
      value: 'login'
    }, {
      title: 'Cancel',
      value: 'cancel'
    }],
    initial: 0
  });
  await {
    cancel: () => process.exit(0),
    login: () => loginPrompt(context)
  }[value]();
};

const authenticate = async context => {
  await authenticationStatus(context);
  const {
    currentActor
  } = context;

  if (currentActor) {
    return;
  }

  if (context.nonInteractive) {
    throw new AuthenticationError('Deploy token is invalid or disabled!');
  }

  return await authenticatePrompt(context);
};

module.exports = authenticate;