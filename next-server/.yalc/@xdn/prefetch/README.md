# XDN Prefetch

XDN Prefetch makes it easy to prefetch dynamic content cached at the network edge and store it in the browser's service worker cache. 

## Caching Routes

To make a response prefetchable, it needs to cache the response both at the edge and in the service worker.  You can do this using `cache`:

```js
// routes.js
import { Router } from '@xdn/core/router'

new Router()
  .match('/some/path', ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 // one day
      },
      browser: {
        serviceWorkerSeconds: 60 * 60 // one hour
      }
    })
  })
```

## Prefetching Content

To prefetch a URL, call the following from JavaScript running in the browser window:

```js
import { prefetch } from '@xdn/prefetch/window'

prefetch('/some/path')
```

This will send a request with the following header:

* `x-xdn-prefetch: 1`

To minimize the load on your origin servers, the XDN will only serve prefetch requests from the edge cache.  If a prefetch request cannot be fulfilled from the edge cache, the XDN will respond with http status `412 PRECONDITION FAILED`.

## Configuring your Service Worker using Workbox

We recommend using Workbox's [InjectManifest webpack plugin](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest) to create your service worker.  To enable prefetching, simply create an instance of `Prefetcher` and call its `route()` method.  Here's an example
service worker:

```js
import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { Prefetcher } from '@xdn/prefetch/sw'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher().route()
```
