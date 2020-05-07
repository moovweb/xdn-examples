"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
var path_1 = require("path");
var constants_1 = require("../constants");
var http_1 = require("http");
var serveStatic_1 = __importDefault(require("./serveStatic"));
var webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
var bundle_1 = require("../deploy/bundle");
var express_1 = __importDefault(require("express"));
var loadRouter_1 = __importDefault(require("../router/loadRouter"));
var ensureServerStarted_1 = __importDefault(require("../lambda/ensureServerStarted"));
var createLocalBackends_1 = __importStar(require("./createLocalBackends"));
function createDevServer(param1, param2) {
    var server, options;
    if (typeof param1 === 'function') {
        server = param1;
        options = param2;
    }
    else {
        server = undefined;
        options = param1;
    }
    var _a = (options || {}).port, port = _a === void 0 ? parseInt(process.env.PORT || '3000', 10) : _a;
    var assetPort = port + 1;
    // @ts-ignore
    var assetServer = http_1.createServer(serveStatic_1.default);
    var xdn = express_1.default();
    xdn.use(webpack_dev_middleware_1.default(bundle_1.createCompiler(), {
        stats: 'errors-only',
        logLevel: 'error',
        writeToDisk: true,
        publicPath: path_1.join(process.cwd(), '.xdn', 's3'),
    }));
    xdn.use(function (req, res) {
        // ensure that the router is reloaded on every request in development
        delete require.cache[bundle_1.ROUTER_DESTINATION];
        var router = loadRouter_1.default(bundle_1.ROUTER_DESTINATION);
        createLocalBackends_1.default(assetPort + 1);
        router.setBackend(constants_1.BACKENDS.static, {
            domainOrIp: createLocalBackends_1.LOCAL_HOST,
            port: assetPort,
        });
        router.run(req, res);
    });
    var promises = __spread([
        new Promise(function (resolve, reject) {
            try {
                xdn.listen(port, resolve);
            }
            catch (e) {
                reject(e);
            }
        }),
        new Promise(function (resolve, reject) {
            try {
                assetServer.listen(assetPort, resolve);
            }
            catch (e) {
                reject(e);
            }
        })
    ], createLocalBackends_1.default(assetPort + 1).map(ensureServerStarted_1.default));
    return Promise.all(promises)
        .then(function () { return console.log("> XDN ready on http://127.0.0.1:" + port); })
        .catch(function (err) { return console.log('error', err); });
}
exports.default = createDevServer;
