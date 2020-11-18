// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require('@xdn/core/Router')
const { angularRoutes } = require('@xdn/angular')

const PAGE_TTL = 60 * 60 * 24
const FAR_FUTURE_TTL = 60 * 60 * 24 * 365 * 10

const CACHE_PAGE = {
  browser: {
    maxAgeSeconds: PAGE_TTL,
    serviceWorkerSeconds: PAGE_TTL,
    // spa: true
  },
  edge: {
    maxAgeSeconds: PAGE_TTL,
    staleWhileRevalidateSeconds: PAGE_TTL,
    forcePrivateCaching: true,
  },
}

const CACHE_API = {
  browser: {
    maxAgeSeconds: PAGE_TTL,
    serviceWorkerSeconds: PAGE_TTL,
  },
  edge: {
    maxAgeSeconds: PAGE_TTL,
    staleWhileRevalidateSeconds: PAGE_TTL,
    forcePrivateCaching: true,
  },
}

const CACHE_ASSETS = {
  browser: {
    maxAgeSeconds: PAGE_TTL,
    serviceWorkerSeconds: PAGE_TTL
  },
  edge: {
    maxAgeSeconds: FAR_FUTURE_TTL,
    staleWhileRevalidateSeconds: PAGE_TTL,
    forcePrivateCaching: true
  }
}

module.exports = new Router()
  .match('/rest/v2/:path*', ({ cache, proxy }) => {
    cache(CACHE_API)
    proxy('commerce')
  })
  .match('/medias/:path*', ({ cache, proxy }) => {
    cache(CACHE_ASSETS)
    proxy('commerce')
  })
  .post('/authorizationserver/oauth/:path*', ({ proxy }) => {
    proxy('commerce')
  })
  // Example Route:
  // .match('/products/:path', ({ cache }) => {
  //   cache(CACHE_PAGE)
  // })
  .match('/service-worker.js', ({ setResponseHeader, serviceWorker }) => {
    setResponseHeader('content-type', 'application/javascript')
    serviceWorker('dist/spartacus-ex2/browser/service-worker.js')
  })
  .use(angularRoutes)
