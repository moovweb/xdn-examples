"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = withServiceWorker;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _nextOffline = _interopRequireDefault(require("next-offline"));

var _path = require("path");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function withServiceWorker() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var workboxOpts = _ref.workboxOpts,
      config = (0, _objectWithoutProperties2["default"])(_ref, ["workboxOpts"]);
  return (0, _nextOffline["default"])(_objectSpread({
    target: 'serverless',
    generateInDevMode: true,
    generateSw: false,
    workboxOpts: _objectSpread({
      swSrc: (0, _path.join)(process.cwd(), 'sw', 'service-worker.js'),
      swDest: (0, _path.join)(process.cwd(), '.next', 'static', 'service-worker.js'),
      // The asset names for page chunks contain square brackets, eg [productId].js
      // Next internally injects these chunks encoded, eg %5BproductId%5D.js
      // For precaching to work the cache keys need to match the name of the assets
      // requested, therefore we need to transform the manifest entries with encoding.
      manifestTransforms: [function (manifestEntries) {
        console.log('> Creating service worker...');
        var manifest = manifestEntries.filter(function (entry) {
          return !entry.url.includes('next/dist');
        }) // these paths fail in development resulting in the service worker not being installed
        .map(function (entry) {
          entry.url = encodeURI(entry.url);
          return entry;
        });
        return {
          manifest: manifest,
          warnings: []
        };
      }]
    }, workboxOpts)
  }, config));
}

module.exports = exports.default;