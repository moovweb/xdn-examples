const { Router } = require('@xdn/core/router')
const { nuxtRoutes, renderNuxtPage } = require('@xdn/nuxt')

const HTML = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true
  },
  browser: false
}

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .get('/', ({ cache }) => {
    cache(HTML)
  })
  .get('/c/:slug*', ({ cache }) => {
    cache(HTML)
  })
  .get('/p/:slug*', ({ cache }) => {
    cache(HTML)
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage)
