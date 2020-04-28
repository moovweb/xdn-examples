// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require('@xdn/core/router')
const { createNuxtPlugin } = require('@xdn/nuxt')
const { nuxtMiddleware } = createNuxtPlugin()

module.exports = new Router().use(nuxtMiddleware)
