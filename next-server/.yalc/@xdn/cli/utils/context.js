"use strict";

const {
  getApiKey,
  saveApiKey
} = require('./config');

const Api = require('./api');

const Logger = require('./logger');

const {
  AuthenticationError
} = require('./errors');

class Context {
  constructor(argv) {
    const {
      apiUrl,
      token,
      verbose,
      nonInteractive
    } = argv;
    this.verbose = verbose;
    this.nonInteractive = nonInteractive || !!token;
    this.apiUrl = apiUrl;
    this.apiKey = token || getApiKey(apiUrl);
    this.apiKeyOverride = !!token; // Will contain the name of authenticated user

    this.currentActor = null;
    this.api = new Api(this);
    this.logger = new Logger(this);
  }

  onLogin(name, apiKey) {
    this.currentActor = {
      name
    };
    this.apiKey = apiKey;
    saveApiKey(this.apiUrl, apiKey);
  }

  async checkAuthentication() {
    if (!this.apiKey) {
      return;
    }

    try {
      this.currentActor = await this.api.currentActor();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return;
      }

      throw e;
    }
  }

  logout() {
    this.currentActor = null;
    saveApiKey(this.apiUrl, null);
  }

}

module.exports = Context;