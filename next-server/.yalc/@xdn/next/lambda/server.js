"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("path");

/* istanbul ignore file */

/**
 * Creates the http server that runs within the XDN lambda to serve next.js requests.
 * @return {http.Server}
 */
var _default = function _default(req, res) {
  var page = req.headers['x-next-page']; // sent by createNextRenderer

  try {
    var mod = require((0, _path.join)(process.cwd(), 'pages', page));

    if (mod.render instanceof Function) {
      // Is a React component
      mod.render(req, res);
    } else {
      // Is an API
      mod["default"](req, res);
    }
  } catch (e) {
    var message = "An unexpected error occurred while processing the request with next.js. (page=\"".concat(page, "\")");
    console.error(message, e);
    res.writeHead(500);
    res.end(message);
  }
};

exports["default"] = _default;
module.exports = exports.default;