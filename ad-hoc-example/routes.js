// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { BACKENDS } = require('@xdn/core/constants')
const { Router } = require('@xdn/core/router')
const { isProductionBuild } = require('@xdn/core/environment')

const PUBLIC_CACHE_CONFIG = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24
  },
  browser: {
    serviceWorkerSeconds: 60 * 60 * 24
  }
}

const HTML_CACHE_CONFIG = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24
  },
}

const FAR_FUTURE_CACHE_CONFIG = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24 * 365 * 10
  },
  browser: {
    serviceWorkerSeconds: 60 * 60 * 24 * 365 * 10
  }
}

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker(
      `__sapper__/${isProductionBuild() ? 'build' : 'dev'}/service-worker.js`
    )
  })
  .static('static', { handler: () => res => res.cache(PUBLIC_CACHE_CONFIG) })
  .match('/client/:path*', async ({ proxy, serveStatic, cache }) => {
    if (isProductionBuild()) {
      cache(FAR_FUTURE_CACHE_CONFIG)
      serveStatic('__sapper__/build/client/:path*')
    } else {
      proxy(BACKENDS.js)
    }
  })
  .get('/', ({ cache }) => cache(HTML_CACHE_CONFIG))
  .match('/__sapper__', ({ stream }) => stream('__js__'))
  .fallback(({ proxy }) => {
    proxy(BACKENDS.js)
  })
