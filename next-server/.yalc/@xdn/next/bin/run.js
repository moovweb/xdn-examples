"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _url = require("url");

var _next = _interopRequireDefault(require("next"));

var _createDevServer = _interopRequireDefault(require("@xdn/core/server/createDevServer"));

/* istanbul ignore file */
if (process.env.preact === 'true') {
  var moduleAlias = require('module-alias');

  moduleAlias.addAlias('react', 'preact/compat');
  moduleAlias.addAlias('react-dom', 'preact/compat');
  moduleAlias.addAlias('react-ssr-prepass', 'preact-ssr-prepass');
}

function run() {
  var dev, app;
  return _regenerator["default"].async(function run$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('> Starting Next.js...'); // compile the next.js app for development

          dev = process.env.NODE_ENV !== 'production';
          app = (0, _next["default"])({
            dev: dev
          });
          _context.next = 5;
          return _regenerator["default"].awrap(app.prepare());

        case 5:
          (0, _createDevServer["default"])(function (req, res) {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            var parsedUrl = (0, _url.parse)(req.url, true);

            try {
              var page = req.headers['x-next-page']; // sent by createNextRenderer

              if (page && !page.startsWith('/api')) {
                // In next.js, only SSR requests can use app.render
                app.render(req, res, page, parsedUrl.query);
              } else {
                // There is no way to force next.js to serve an api request from a specific handler other than modifying the URL path
                if (page) parsedUrl.pathname = page; // api routes must be processed through next.js's built in request handler

                app.getRequestHandler()(req, res, parsedUrl);
              }
            } catch (e) {
              res.writeHead(500);
              res.end(e.stack);
            }
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
}

run();