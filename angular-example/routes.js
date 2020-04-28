'use strict'

// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { Router } = require('@xdn/core/Router')

const createAngularPlugin = require('@xdn/angular/router/createAngularPlugin')

module.exports = app => {
  const { angularMiddleware } = createAngularPlugin(app)
  return new Router().use(angularMiddleware)
}
