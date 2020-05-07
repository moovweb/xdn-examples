"use strict";

const authenticationStatus = async context => {
  const {
    apiKey,
    currentActor,
    apiUrl,
    logger
  } = context;

  if (currentActor) {
    logger.success(`🔑 Authenticated as ${currentActor.name} on ${apiUrl}\n`);
    return true;
  }

  if (apiKey) {
    logger.error(`🔑 Incorrect apiKey for ${apiUrl}\n`);
  } else {
    logger.warning(`🔑 You are not logged in on ${apiUrl}\n`);
  }

  return false;
};

module.exports = authenticationStatus;