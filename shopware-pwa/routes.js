const { Router } = require('@xdn/core/router')
const { renderNuxtPage, nuxtRoutes } = require('@xdn/nuxt')

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage)
