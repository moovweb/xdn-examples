import { Router, CustomCacheKey } from '@xdn/core/router'
import { CACHE_SERVICE_WORKER } from './cache'

export default new Router()
  .match('/service-worker.js', ({ serveStatic, cache }) => {
    cache(CACHE_SERVICE_WORKER)
    return serveStatic('dist/service-worker.js')
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
    return serveStatic('dist/browser.js')
  })
  // jsonp from service worker
  .match(
    {
      path: '/fetch-data',
      headers: {
        'x-xdn-from-sw': /true/,
      },
    },
    async ({ cache, send }) => {
      cache({
        // @ts-ignore
        browser: {
          maxAgeSeconds: 0,
          serviceWorkerSeconds: 60 * 60,
        },
        edge: {
          maxAgeSeconds: 60 * 60,
          key: new CustomCacheKey().excludeAllQueryParametersExcept('foo'),
        },
      })

      await send(`jQuery35106546810873918889_1589791355847(${JSON.stringify({ success: true })})`)
    }
  )
  // jsonp without service worker
  .match('/fetch-data', async ({ cache, send }) => {
    await send(`jQuery35106546810873918889_1589791355847(${JSON.stringify({ success: true })})`)
  })
  .match('/', ({ serveStatic }) => {
    return serveStatic('public/index.html')
  })
  .fallback(({ proxy }) => {
    return proxy('origin')
  })
