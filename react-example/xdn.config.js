const { join } = require('path')

module.exports = {
  server: {
    path: join(__dirname, 'dist', 'server.js'),
  },
  backends: {},
}
