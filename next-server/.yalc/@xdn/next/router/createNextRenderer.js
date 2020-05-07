"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createNextRenderer;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _qs = _interopRequireDefault(require("qs"));

var _addPreloadHeaders = _interopRequireDefault(require("@xdn/core/router/addPreloadHeaders"));

var _constants = require("@xdn/core/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Creates a function that proxies a request to next.js.
 * @return {Function} A function that accepts a request, response, proxy, and page and renders a response using next.js.
 */
function createNextRenderer() {
  return function _callee(req, proxy, params) {
    var url, query, path;
    return _regenerator["default"].async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = req.url, query = req.query;
            path = url.split(/\?/)[0]; // here we override params on the incoming request with params specified by the developer
            // so that the developer can be sure that things like productId which they specify take precedence

            query = _objectSpread({}, _qs["default"].parse(query), {}, params);
            path = "".concat(path).concat(_qs["default"].stringify(query, {
              addQueryPrefix: true
            }));
            _context.next = 6;
            return _regenerator["default"].awrap(proxy(_constants.BACKENDS.js, {
              path: path,
              transformResponse: _addPreloadHeaders["default"]
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, null, Promise);
  };
}

module.exports = exports.default;