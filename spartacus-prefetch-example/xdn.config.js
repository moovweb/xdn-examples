"use strict";

// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { join } = require('path')

module.exports = {
  server: {
    path: join(__dirname, 'dist/server.js')
  },
  backends: {
    commerce: {
      domainOrIp: 'aemspartacusapi.tmg.codes',
      hostHeader: 'aemspartacusapi.tmg.codes'
    }
  }
}
