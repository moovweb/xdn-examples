"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Converts next path to express route syntax
 *
 * @example
 * /[param1]/[param2] => /:param1/:param2
 * /[...path] => /*path
 */
var _default = function _default(pagePath) {
  return pagePath.replace(/\[\.\.\.([^\]]+)\]/g, '*$1').replace(/\[([^\]]+)\]/g, ':$1');
};

exports["default"] = _default;
module.exports = exports.default;