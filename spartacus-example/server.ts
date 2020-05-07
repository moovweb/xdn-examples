import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import * as http from 'http'
import * as https from 'https'

import { createNamespace } from 'cls-hooked'
const requestsNamespace = createNamespace('requests')

const patchHttpModule = (module) => {
  const originalGetFn = module.get
  module.get = function(...args) {
    const requestsSet = requestsNamespace.active && requestsNamespace.get('requests')

    if (requestsSet) {
      let path
      const options = args[0]
      if (typeof options === 'string') {
        path = options
      } else {
        path = `${options.protocol}://${options.host || options.hostname}${options.path || '/'}`
      }

      console.log(path)
      requestsSet.add(path)
    }

    return originalGetFn(...args)
  }

  const originalRequestFn = module.request
  module.request = function(...args) {
    const request = originalRequestFn(...args)
    const originalEndFn = request.end.bind(request)
    request.end = (function(...args) {
      console.log('requestsNamespace.active', requestsNamespace.active)
      const requestsSet = requestsNamespace.active && requestsNamespace.get('requests')
      if (requestsSet) {
        let path
        const options = args[0]
        if (typeof options === 'string') {
          path = options
        } else {
          path = `${options.protocol}://${options.host || options.hostname}${options.path || '/'}`
        }

        console.log(path)
        requestsSet.add(path)
      }
      return originalEndFn(...args)
    }).bind(request)
    return request
  }
}

const patchHttp = () => {
  patchHttpModule(http)
  patchHttpModule(https)
}

patchHttp()

// Express server
const app = express();

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
  requestsNamespace.run(function() {
    const requests = new Set()
    requestsNamespace.set('requests', requests)

    requestsNamespace.bindEmitter(req)
    requestsNamespace.bindEmitter(res)

    const originalEndFn = res.end.bind(res)
    res.end = function(...args) {
      console.log('req.end', requests)
      return originalEndFn(...args)
    }
  
    res.render('index', { req });
  })
});

export default app
