const { Router } = require('@xdn/core/router');
const { nuxtRoutes, renderNuxtPage } = require('@xdn/nuxt');

const HTML = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true
  },
  browser: false
};

const cacheHtml = ({ cache, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie');
  cache(HTML);
};

module.exports = new Router()
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js');
  })
  .get('/', cacheHtml)
  .get('/c/:slug*', cacheHtml)
  .get('/p/:slug*', cacheHtml)
  .use(nuxtRoutes)
  .fallback(renderNuxtPage);
