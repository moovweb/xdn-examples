// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { Router } = require('@xdn/core/router')
const { createNextPlugin } = require('@xdn/next')
const { nextMiddleware } = createNextPlugin()

module.exports = new Router()
  .match('/service-worker.js', ({ cache, serveStatic }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      browser: {
        maxAgeSeconds: 0,
      },
    })
    return serveStatic('.next/static/service-worker.js')
  })
  .use(nextMiddleware) // automatically adds routes for all files under /pages
