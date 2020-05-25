# Creating Spartacus app

The steps below are pulled from the Spartacus official docs, which are published here: https://sap.github.io/spartacus-docs/building-the-spartacus-storefront-from-libraries/

Make sure to install @angular/cli 8. Spartacus does not support 9. `npm install -g @angular/cli@8`

Create an angular app

> When prompted if you would like to add Angular routing, enter n for ‘no’.
```
ng new xdn-spartacus-app --style=scss
cd xdn-spartacus-app
```

Add the Spartacus scaffold via schematic

```
ng add @spartacus/schematics --ssr
```

Note the SSR parameter. This is needed for server-side rendering to work properly when deploying on the XDN.

Replace the contents of src/app/app.component.html with:

```html
<cx-storefront>Loading...</cx-storefront>
```

Update `app.module.ts` to include a `baseSite` configuration:

```diff
 B2cStorefrontModule.withConfig({
  backend: {
    occ: {
      baseUrl: 'https://localhost:9002',
      prefix: '/rest/v2/'
    }
  },
+ context: {
+   baseSite: ['electronics-spa']
+ },
  i18n: {
    resources: translations,
    chunks: translationChunksConfig,
    fallbackLang: 'en'
  },
  features: {
    level: '1.5',
    anonymousConsents: true
  }
 }),
```

# Preparing for deployment on the XDN

```
npm install -g @xdn/cli
xdn init
```

The app should now have `@xdn` dependencies installed and auto-generated `routes.js` and `xdn.config.js` files created by `@xdn/angular`.

`@xdn/angular` follows Angular 9 SSR scaffolding so the following changes are necessary to the server build:

1. Modify the `output` block of `webpack.server.config.js` to a UMD library target with `default` export

```diff
output: {
+   libraryTarget: 'umd',
+   libraryExport: 'default',
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
```

2. Have `server.ts` export the Express app and remove server initialization:

```diff
-// Start up the Node server
-app.listen(PORT, () => {
-  console.log(`Node server listening on http://localhost:${PORT}`);
-});
+export default app
```

3. Update `xdn.config.js` to specify the location of the server build:

```diff
"use strict";
// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { join } = require('path')
module.exports = {
  server: {
+   path: join(__dirname, 'dist/server.js')
-   path: join(__dirname, 'dist/xdn-spartacus-app-server/main.js'),
-   export: 'app'
  },
}
```

Configure a backend in `xdn.config.js` that points to the commerce API:

```diff
// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { join } = require('path')
module.exports = {
  server: {
    path: join(__dirname, 'dist/server.js')
    export: 'app'
  },
+ backends: {
+   commerce: {
+     domainOrIp: 'aemspartacusapi.tmg.codes',
+     hostHeader: 'aemspartacusapi.tmg.codes',
+   },
+ }
}
```

Configure `routes.js` to proxy API and media requests to the Commerce backend:

```diff
// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const { Router } = require('@xdn/core/Router')
const createAngularPlugin = require('@xdn/angular/router/createAngularPlugin')
module.exports = app => {
  const { angularMiddleware } = createAngularPlugin(app)
- return new Router().use(angularMiddleware)
+ return new Router()
+   .match('/rest/v2/*path', ({ proxy }) => {
+     return proxy('commerce')
+   })
+   .match('/medias/*path', ({ proxy }) => {
+     return proxy('commerce')
+   })
+   .use(angularMiddleware)
}
```

Here you can also configure all caching for individual paths.

Configure the commerce baseUrl to point to XDN.

In `app.module.ts`:

```diff
 B2cStorefrontModule.withConfig({
  backend: {
    occ: {
-     baseUrl: 'https://localhost:9002',
+     baseUrl: 'https://YOUR_XDN_DEPLOYMENT_URL'
      prefix: '/rest/v2/'
    }
  },
  context: {
    baseSite: ['electronics-spa']
  },
  i18n: {
    resources: translations,
    chunks: translationChunksConfig,
    fallbackLang: 'en'
  },
  features: {
    level: '1.5',
    anonymousConsents: true
  }
 }),
```

In `ìndex.html`:

```diff
-<meta name="occ-backend-base-url" content="https://localhost:9002" />
+<meta name="occ-backend-base-url" content="https://YOUR_XDN_DEPLOYMENT_URL" />
```

In `environment.prod.ts`:

```diff
environment = {
  production: true,
+ occBaseUrl: 'https://YOUR_XDN_DEPLOYMENT_URL',
};
```

# Deploying to XDN

```
xdn deploy
```

# Adding prefetching

## Upstream request tracking

Prefetching for a Spartacus app can be enabled by listening to upstream requests made when server-side rendering a specific page. `@xdn/prefetch` library will pick up on the upstream requests made by reading the `x-xdn-upstream-requests` response header. An example scenario:
1) User A lands on `/product/1`.
2) `/product/1` has not been cached in the edge and thus will be server-side rendered.
3) The rendering server has been modified to track upstream requests by patching `https.request`.
4) The rendering server sets `x-xdn-upstream-requests` to for example `/rest/v2/1;/rest/v2/2;`
5) The HTML response for `/product/1` is now cached and for future requests served from the edge along with the `x-xdn-upstream-requests` response header.
6) User B lands on a page that has a link to `/product/1`. `/product/*path` has been configured with `cache.browser.spa: true`. Because of this configuration `@xdn/prefetch` will know to make a prefetch HEAD request for `/product/1` and only if `product/1` can be served from the edge will prefetch all requests specified in `x-xdn-upstream-requests` response header.
7) When user B click the link to `/product/1` the navigation will be faster since the requests needed to render the new page will be in service worker cache.

Example implementation of upstream request tracking:

```js
import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import * as http from 'http'
import * as https from 'https'

import { createNamespace } from 'cls-hooked'
const ns = createNamespace('app')

const originalHttpRequest = http.request
const originalHttpsRequest = https.request

const requestIdMiddleware = (req, res, next) => {
  ns.bindEmitter(req)
  ns.bindEmitter(res)
  ns.run(() => {
    patchHttp()
    const requests = new Set()
    ns.set("requestId", requests);
    next();
  });
};

const patchHttpModule = (module, orig) => {
  module.request = ns.bind(function(...args) {
    const requestsSet = ns.get('requestId')
    if (requestsSet && args[0]) {
      let path
      const options = args[0]
      if (typeof options === 'string') {
        path = options
      } else {
        path = options.path
      }
      const newSet = requestsSet.add(path)
      ns.set('requestId', newSet)
    }
    return orig(...args)
  })
}

const patchHttp = () => {
  patchHttpModule(http, originalHttpRequest)
  patchHttpModule(https, originalHttpsRequest)
}

// Express server
const app = express();
app.use(requestIdMiddleware);

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist/xdn-spartacus-app');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap,
} = require('./dist/xdn-spartacus-app-server/main');

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y',
  })
);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  const callback = (err, html) => {
    const requestsArray = Array.from(ns.get("requestId"))
    let header = ''
    requestsArray.forEach(request => {
      header += (request + ';')
    })
    res.set('x-xdn-upstream-requests', header)

    res.send(html)
  }
  res.render('index', { req }, ns.bind(callback));
});

export default app
```

## Service worker

`@xdn/prefetch` relies on Google's `workbox` library. Thus in the context of an Angular app a custom service-worker solution is necessary. Under the `src/sw` directory create the following files:

`service-worker.js`
```js
import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { Prefetcher } from '@xdn/prefetch/sw'

declare const self: any;

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher().route()
```

`webpack.dev.config.js`
```js
// DEV Webpack configuration used to build the service worker

const path = require("path");
const webpack = require("webpack");
const webBuildTargetFolder = path.join(__dirname, "..", "..", "dist", "xdn-spartacus-app");
const targetServiceWorkerFilename = "service-worker.js";

module.exports = {
  target: "node",
  mode: "none",
  entry: {
    index: path.join(__dirname, "service-worker.ts"),
  },
  resolve: { extensions: [".js", ".ts"] },
  output: {
    path: webBuildTargetFolder,
    filename: targetServiceWorkerFilename,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      XDN_PREFETCH_QUERY_PARAM: '__prefetch__',
      XDN_PREFETCH_CACHE_NAME: 'prefetch',
      XDN_HEADER_PREFETCH_QUERY_PARAM: '__header-prefetch__',
      PREFETCH_RESPONSE_HEADER_NAME: 'x-xdn-upstream-requests',
      PREFETCH_HEADER_NAME: 'x-xdn-prefetch',
      XDN_PREFETCH_HEADER_VALUE: '1',
      NODE_ENV: 'production',
      DEEP_FETCH_HEADER_NAME: 'x-xdn-deep-prefetch'
    })
  ],
};
```

`webpack.prod.config.js`
```js
const webpackDevConfig = require("./webpack.dev.config");

module.exports = Object.assign({}, webpackDevConfig, {
  mode: "production",
});
```

`workbox-build-inject.js`
```js
// Script that modifies the service-worker.js configuration using workbox-build
// Reference: https://developers.google.com/web/tools/workbox/modules/workbox-build

const { injectManifest } = require("workbox-build");

const workboxConfig = require("./workbox-config");

console.log(`Workbox configuration: `, workboxConfig);

injectManifest(workboxConfig).then(({ count, size }) => {
  console.log(`Generated ${workboxConfig.swDest}, which will precache ${count} files (${size} bytes)`);
});
```

`workbox-config.js`
```js
module.exports = {
  globDirectory: "dist/xdn-spartacus-app/",
  globPatterns: ["**/*.{css,eot,html,ico,jpg,js,json,png,svg,ttf,txt,webmanifest,woff,woff2,webm,xml}"],
  globFollow: true, // follow symlinks
  globStrict: true, // fail the build if anything goes wrong while reading the files
  globIgnores: [`**/*-es5.*.js`],
  // Look for a 20 character hex string in the file names
  // Allows to avoid using cache busting for Angular files because Angular already takes care of that!
  dontCacheBustURLsMatching: new RegExp(".+.[a-f0-9]{20}..+"),
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4Mb
  swSrc: "dist/xdn-spartacus-app/service-worker.js",
  swDest: "dist/xdn-spartacus-app/service-worker.js",
};
```

These files form the base for building a functional service-worker and can be further customized for any app-specific needs.

To build the service worker add the following command to `package.json`:
```js
{
  ...
  "build:pwa:web": "rimraf ./dist/xdn-spartacus-app/service-worker.js && webpack --config ./src/sw/webpack.prod.config.js --progress --colors && node ./src/sw/workbox-build-inject.js",
  "postbuild:ssr": "npm run build:pwa:web",
  ...
}
```

`workbox-build` needs to be installed for the injection.

Add a polyfill for `window.process` if not already present in `polyfills.ts`:
```js
...
(window as any).process = {
  env: {
    'DEBUG_SW': true
  }
}
...
```

The build command places the built `service-worker.js` under `dist` so `@xdn/angular` will know to static serve the file.

Installing the service worker and any further prefetching will be handled by `@xdn/prefetch` by invoking the `install` function imported from `@xdn/prefetch/window/install`.

Example implementation in `app.component.ts`:
```js
import { Component, OnInit, Inject } from '@angular/core';
import install from '@xdn/prefetch/window/install';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isBrowser: boolean
  title = 'xdn-spartacus-app';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.isBrowser) {
        install()
      }
    })
  }
}
```

## Cache configuration

An example cache configuration to optimally support prefetching:

`routes.js`
```js
// This file was automatically added by xdn deploy.
// You should commit this file to source control.

const { Router } = require('@xdn/core/Router')
const createAngularPlugin = require('@xdn/angular/router/createAngularPlugin')

const PAGE_TTL = 60 * 60 * 24
const FAR_FUTURE_TTL = 60 * 60 * 24 * 365 * 10

module.exports = app => {
  const { angularMiddleware } = createAngularPlugin(app)
  return new Router()
    .match('/rest/v2/*path', ({ cache, proxy }) => {
      cache({
        browser: {
          maxAgeSeconds: PAGE_TTL,
          serviceWorkerSeconds: PAGE_TTL,
        },
        edge: {
          maxAgeSeconds: PAGE_TTL,
          staleWhileRevalidateSeconds: PAGE_TTL,
        },
      })
      return proxy('commerce')
    })
    .match('/medias/*path', ({ cache, proxy }) => {
      cache({
        browser: {
          maxAgeSeconds: PAGE_TTL,
          serviceWorkerSeconds: PAGE_TTL,
        },
        edge: {
          maxAgeSeconds: FAR_FUTURE_TTL,
          staleWhileRevalidateSeconds: 60 * 60 * 24,
        },
      })
      return proxy('commerce')
    })
    .match('/Open-Catalogue/*path', ({cache}) => {
      cache({
        browser: {
          maxAgeSeconds: PAGE_TTL,
          serviceWorkerSeconds: PAGE_TTL,
          spa: true,
        },
        edge: {
          maxAgeSeconds: PAGE_TTL,
          staleWhileRevalidateSeconds: PAGE_TTL,
        },
      })
    })
    .match('/product/*path', ({cache}) => {
      cache({
        browser: {
          maxAgeSeconds: PAGE_TTL,
          serviceWorkerSeconds: PAGE_TTL,
          spa: true,
        },
        edge: {
          maxAgeSeconds: PAGE_TTL,
          staleWhileRevalidateSeconds: PAGE_TTL,
        },
      })
    })
    .use(angularMiddleware)
}
```

Notice the `spa: true` in `/product/*path` and `/Open-Catalogue/*path` browser cache configuration. These are both routes that can appear in the form of links on any given page. With `spa: true` `@xdn/prefetch` will know to optimally only fully prefetch the upstream requests specified in the cached responses for those routes.

Add `"skipLibCheck": true,` to `tsconfig.json` to avoid type errors from `workbox` library during build.
