"use strict";

const Conf = require('conf');

const authConfig = new Conf({
  configName: 'auth',
  projectName: 'xdn'
});

const authTokenKey = apiUrl => `auth.${apiUrl}`;

exports.getApiKey = apiUrl => {
  return authConfig.get(authTokenKey(apiUrl));
};

exports.saveApiKey = (apiUrl, apiKey) => {
  return authConfig.set(authTokenKey(apiUrl), apiKey);
};