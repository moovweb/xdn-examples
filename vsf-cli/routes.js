const { Router } = require('@xdn/core/router')
const { nuxtRoutes, renderNuxtPage } = require('@xdn/nuxt')
const { decompressRequest } = require('@xdn/apollo')

const HTML = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true
  },
  browser: false
}

const cacheHTML = ({ cache, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie')
  cache(HTML)
}

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .get('/', cacheHTML)
  .get('/c/:slug*', cacheHTML)
  .get('/p/:slug*', cacheHTML)
  .match('/:env/graphql', ({ proxy, cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      browser: {
        serviceWorkerSeconds: 60 * 60 * 24 * 365,
      }
    })
    proxy('api', { 
      transformRequest: decompressRequest 
    })
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage)
