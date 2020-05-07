const { Router } = require('@xdn/core/router')
const { createNextPlugin } = require('@xdn/next')
const { nextMiddleware } = createNextPlugin()

module.exports = new Router()
  .use(nextMiddleware)
