const { join } = require('path')

module.exports = {
  backends: {
    react: {
      handler: {
        path: join(__dirname, 'dist', 'server.js'),
      },
    },
  },
}
