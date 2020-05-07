"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _PluginBase2 = _interopRequireDefault(require("@xdn/core/plugins/PluginBase"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _nextPathToRouteSyntax = _interopRequireDefault(require("./nextPathToRouteSyntax"));

var _environment = require("@xdn/core/environment");

var _constants = require("@xdn/core/constants");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * A TTL for assets that never change.  10 years in seconds.
 */
var FAR_FUTURE_TTL = 60 * 60 * 24 * 365 * 10;
var FAR_FUTURE_CACHE_CONFIG = {
  browser: {
    maxAgeSeconds: FAR_FUTURE_TTL
  },
  edge: {
    maxAgeSeconds: FAR_FUTURE_TTL
  }
};
var PUBLIC_CACHE_CONFIG = {
  edge: {
    maxAgeSeconds: FAR_FUTURE_TTL
  }
};

var NextRoutes = /*#__PURE__*/function (_PluginBase) {
  (0, _inherits2["default"])(NextRoutes, _PluginBase);

  var _super = _createSuper(NextRoutes);

  /**
   * Provides next registered routes to router
   * @param {Function} renderFn Next page render function
   */
  function NextRoutes(renderFn) {
    var _this;

    (0, _classCallCheck2["default"])(this, NextRoutes);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "type", 'NextRoutes');
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "nextRouteGroupName", 'next_routes_group');
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "nextRootDir", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "nextRenderFunction", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "router", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateNextRoutesDebounce", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "manifest", []);

    if (!renderFn) {
      throw new Error('NextRoutes: "renderFn" must be provided.');
    }

    _this.nextRootDir = process.cwd();
    _this.nextRenderFunction = renderFn;
    _this._updateNextRoutesDebounce = (0, _debounce["default"])(_this.updateRoutes.bind((0, _assertThisInitialized2["default"])(_this)), 1000);
    return _this;
  }
  /**
   * Called when plugin is registered
   * @param {Router} router
   */


  (0, _createClass2["default"])(NextRoutes, [{
    key: "onRegister",
    value: function onRegister(router) {
      var _this2 = this;

      this.router = router;
      /* create route group and add all next routes into it */

      this.router.group(this.nextRouteGroupName, function (group) {
        return _this2.addNextRoutesToGroup(group);
      });
    }
    /**
     * Call update routes debounce so routes will be updated once next route is detected
     */

  }, {
    key: "onRequest",
    value: function onRequest() {
      if ((0, _environment.isProductionBuild)()) return;

      this._updateNextRoutesDebounce();
    }
    /**
     * Update routes
     */

  }, {
    key: "updateRoutes",
    value: function updateRoutes() {
      var routeGroup = this.router.routeGroups.findByName(this.nextRouteGroupName).clear();
      this.addNextRoutesToGroup(routeGroup);
    }
    /**
     * Adds next routes to route group
     * @param {RouteGroup} group
     */

  }, {
    key: "addNextRoutesToGroup",
    value: function addNextRoutesToGroup(group) {
      this.addDynamicRoutes(group);
      this.addStaticRoutes(group);
    }
    /**
     * Adds routes for react components and API handlers
     * @param {*} group
     */

  }, {
    key: "addDynamicRoutes",
    value: function addDynamicRoutes(group) {
      var _this3 = this;

      // NEXT_PAGES_DIR allows us to crawl .xdn/lambda during production builds so that we can see
      // html files for static pages
      var pagesDirRelative = process.env.NEXT_PAGES_DIR || 'pages';

      var pagesDir = _path["default"].join(this.nextRootDir, pagesDirRelative);

      var pagesFromDir = _glob["default"].sync('**/*', {
        cwd: pagesDir,
        ignore: ['_*']
      });

      var _iterator = _createForOfIteratorHelper(pagesFromDir),
          _step;

      try {
        var _loop = function _loop() {
          var page = _step.value;
          var pagePath = "/".concat(page.replace(/\.(js|html)$/, '') // Remove .js extension
          .replace(/(^|\/)index$/, '')); // Remove index or return root for empty for example: /index.js will result with /

          var pattern = (0, _nextPathToRouteSyntax["default"])(pagePath);

          if (page.endsWith('.html')) {
            // static pages
            group.match(pattern, function _callee(_ref) {
              var cache, serveStatic, dest;
              return _regenerator["default"].async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      cache = _ref.cache, serveStatic = _ref.serveStatic;
                      cache(PUBLIC_CACHE_CONFIG);
                      dest = _path["default"].join(pagesDirRelative, page);

                      _this3.manifest.push({
                        path: pagePath,
                        dest: dest
                      });

                      _context.next = 6;
                      return _regenerator["default"].awrap(serveStatic(dest));

                    case 6:
                    case "end":
                      return _context.stop();
                  }
                }
              }, null, null, null, Promise);
            });
          } else {
            var renderer = function renderer(_ref2) {
              var render, setRequestHeader, proxy;
              return _regenerator["default"].async(function renderer$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      render = _ref2.render, setRequestHeader = _ref2.setRequestHeader, proxy = _ref2.proxy;
                      setRequestHeader('x-next-page', pagePath);
                      _context3.next = 4;
                      return _regenerator["default"].awrap(render(function _callee2(req, _res, params) {
                        return _regenerator["default"].async(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                _context2.next = 2;
                                return _regenerator["default"].awrap(_this3.nextRenderFunction(req, proxy, params));

                              case 2:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, null, null, null, Promise);
                      }));

                    case 4:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, null, null, null, Promise);
            }; // SSR


            group.match(pattern, renderer); // getServerSideProps

            group.match("/_next/data/*build".concat(pattern, ".json"), renderer);
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * Adds routes for static assets, including /public and /.next/static
     * @param {*} group
     */

  }, {
    key: "addStaticRoutes",
    value: function addStaticRoutes(group) {
      var _this4 = this;

      if ((0, _environment.isCloud)()) {
        // public directory
        // Since the files are now on S3, we can no longer crawl the file system to
        // determine the routes, so we use the manifest file
        var manifest = eval('require')(_path["default"].join(process.cwd(), 'static-asset-manifest.json')); // we use eval('require') to prevent webpack from trying to bundle the manifest, which will fail

        var _iterator2 = _createForOfIteratorHelper(manifest),
            _step2;

        try {
          var _loop2 = function _loop2() {
            var _step2$value = _step2.value,
                path = _step2$value.path,
                dest = _step2$value.dest;
            group.match(path, function _callee4(_ref4) {
              var serveStatic, cache;
              return _regenerator["default"].async(function _callee4$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      serveStatic = _ref4.serveStatic, cache = _ref4.cache;
                      cache(PUBLIC_CACHE_CONFIG);
                      _context5.next = 4;
                      return _regenerator["default"].awrap(serveStatic(dest));

                    case 4:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, null, null, null, Promise);
            });
          };

          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop2();
          } // browser js

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        group.match('/_next/static/*path', function _callee3(_ref3) {
          var serveStatic, cache;
          return _regenerator["default"].async(function _callee3$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  serveStatic = _ref3.serveStatic, cache = _ref3.cache;
                  cache(FAR_FUTURE_CACHE_CONFIG);
                  _context4.next = 4;
                  return _regenerator["default"].awrap(serveStatic('.next/static/{path}'));

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, null, null, null, Promise);
        });
      } else {
        // public directory
        var publicDir = _path["default"].join(this.nextRootDir, 'public');

        var _iterator3 = _createForOfIteratorHelper(_glob["default"].sync('**/*', {
          cwd: publicDir
        })),
            _step3;

        try {
          var _loop3 = function _loop3() {
            var file = _step3.value;
            var path = "/".concat(file);
            var dest = "public/".concat(file);

            _this4.manifest.push({
              path: path,
              dest: dest
            });

            group.match(path, function _callee6(_ref7) {
              var serveStatic, cache;
              return _regenerator["default"].async(function _callee6$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      serveStatic = _ref7.serveStatic, cache = _ref7.cache;
                      cache(PUBLIC_CACHE_CONFIG);
                      _context7.next = 4;
                      return _regenerator["default"].awrap(serveStatic(dest));

                    case 4:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, null, null, null, Promise);
            });
          };

          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            _loop3();
          } // webpack hot loader

        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        group.match('/_next/webpack-hmr', function (_ref5) {
          var stream = _ref5.stream;
          return stream('__js__');
        }); // browser js

        group.match('/_next/static/*path', function _callee5(_ref6) {
          var proxy, cache;
          return _regenerator["default"].async(function _callee5$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  proxy = _ref6.proxy, cache = _ref6.cache;
                  cache(FAR_FUTURE_CACHE_CONFIG);
                  _context6.next = 4;
                  return _regenerator["default"].awrap(proxy(_constants.BACKENDS.js));

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, null, null, null, Promise);
        });
      }
    }
  }]);
  return NextRoutes;
}(_PluginBase2["default"]);

exports["default"] = NextRoutes;
module.exports = exports.default;