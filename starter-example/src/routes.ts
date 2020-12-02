import { Router } from '@xdn/core/router'
import { CACHE_SERVICE_WORKER } from './cache'

export default new Router()
  .match('/service-worker.js', ({ serveStatic, cache }) => {
    cache(CACHE_SERVICE_WORKER)
    serveStatic('dist/service-worker.js')
  })
  .match('/main.js', ({ serveStatic, cache }) => {
    cache({
      browser: {
        maxAgeSeconds: 0,
      },
      edge: {
        maxAgeSeconds: 60 * 60 * 365,
      },
    })
    serveStatic('dist/browser.js')
  })
  .fallback(({ proxy }) => {
    proxy('origin')
  })
