## Overview

The `@xdn/core` package provides a JavaScript API for defining edge routing and logic.

## Example Routes File

```js
// routes.js

import { Router } from '@xdn/core/router'
import { createNextPlugin } = from '@xdn/next'

const { renderNext, nextMiddleware } = createNextPlugin()

export default new Router()
  // redirect at edge
  .match('/some/path/:withVar', async ({ redirect }) => {
    await redirect('/some/other/path/{withVar}', 301)
  })

  // proxy the legacy site
  .match('/some/path/:withVar', async ({ proxy }) => {
    await proxy('legacy', {
      path: '/some/other/path/{withVar}',
    })
  })

  // match based on header and proxy the legacy site
  .match({ headers: { 'xdn-device-type': /desktop/ } }, async ({ proxy }) => {
    await proxy('legacy')
  })

  // vanity URL for next.js
  .match('/some/vanity/url/:p', async ({ render }) => {
    await render((req, res, params) =>
      renderNext(req, res, '/p/[productId]', { productId: params.p }),
    )
  })

  // Send a synthetic html response
  .match('/static-html', async ({ respond, responseHeaders }) => {
    responseHeaders({ set: { 'Content-Type': 'text/html; charset=UTF-8' } })
    await respond('<html><body><h1>Hello world!</h1></body></html>', 200)
  })

  // match Next.js routes based on the pages directory
  .use(nextMiddleware)

  // fall back to proxying the legacy site
  .fallback(({ proxy }) => proxy('legacy'))
```
