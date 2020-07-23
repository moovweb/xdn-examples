// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require("@xdn/core/router");
const { nuxtRoutes, renderNuxtPage } = require("@xdn/nuxt");

module.exports = new Router()
  .match("/service-worker.js", ({ serviceWorker }) => {
    serviceWorker(".nuxt/dist/client/service-worker.js");
  })
  .get("/", ({ cache }) => {
    cache({ browser: { maxAgeSeconds: 0 } });
  })
  .get("/posts/:id", ({ cache }) => {
    cache({ browser: { maxAgeSeconds: 0 } });
  })
  .get("/api/posts", ({ proxy, cache }) => {
    cache({
      browser: {
        serviceWorkerSeconds: 60 * 60
      },
      edge: {
        maxAgeSeconds: 60 * 60
      }
    });

    proxy("api", { path: "/posts" });
  })
  .get("/api/posts/:id", ({ proxy, cache }) => {
    cache({
      browser: {
        serviceWorkerSeconds: 60 * 60
      },
      edge: {
        maxAgeSeconds: 60 * 60
      }
    });

    proxy("api", { path: "/posts/:id" });
  })
  .use(nuxtRoutes)
  .fallback(renderNuxtPage);
