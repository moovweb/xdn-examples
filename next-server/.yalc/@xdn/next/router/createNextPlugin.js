"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createNextPlugin;

var _createNextRenderer = _interopRequireDefault(require("./createNextRenderer"));

var _NextRoutes = _interopRequireDefault(require("./NextRoutes"));

function createNextPlugin() {
  var renderNext = (0, _createNextRenderer["default"])();
  var nextMiddleware = new _NextRoutes["default"](renderNext);
  return {
    renderNext: renderNext,
    nextMiddleware: nextMiddleware
  };
}

module.exports = exports.default;