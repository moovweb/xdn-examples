// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require("@xdn/core/router");
const { nuxtRoutes, renderNuxtPage } = require("@xdn/nuxt");

module.exports = new Router()
  .match("/service-worker.js", ({ serviceWorker }) => {
    serviceWorker(".nuxt/dist/client/service-worker.js");
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage);
