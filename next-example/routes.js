// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { Router } = require('@xdn/core/router')
const { createNextPlugin } = require('@xdn/next')
const { nextMiddleware } = createNextPlugin()

const router = new Router()
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
  .match('/_next/data/:build/p/:id.json', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24,
      },
      browser: {
        serviceWorkerSeconds: 60 * 60,
      },
    })
  })
  .use(nextMiddleware)

module.exports = router
