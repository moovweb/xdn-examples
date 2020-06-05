// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require('@xdn/core/router')
const { createNuxtPlugin } = require('@xdn/nuxt')
const { nuxtMiddleware } = createNuxtPlugin()

const pwaRouter = new Router()
.use(nuxtMiddleware)
  
const legacyRouter = new Router()
  .fallback(({ proxy }) => {
    proxy('origin')
  })

module.exports = new Router().destination('pwa', pwaRouter).destination('legacy', legacyRouter)

