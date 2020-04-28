'use strict'

// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { join } = require('path')

module.exports = {
  server: {
    path: join(__dirname, 'dist/my-xdn-angular-app/server/main.js'),
    export: 'app',
  },
}
