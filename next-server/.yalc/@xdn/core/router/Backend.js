"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var path_1 = require("path");
var BackendFetchError_1 = __importDefault(require("../errors/BackendFetchError"));
/**
 * Array of response headers that will not be passed over directly from the proxied resource
 *
 * Notes:
 * - transfer-encoding: as it poisons the response which will be formed
 * based on its own transfer-encoding rather than the one received from the Lambda.
 *
 * - content-length: as the actual constant may be changed by buffer proxy
 * (e.g. on moov_debug=true)
 * @private
 */
var IGNORE_RESPONSE_HEADERS = ['transfer-encoding', 'content-length'];
/**
 * @private
 */
var Backend = /** @class */ (function () {
    function Backend(config) {
        this.config = config;
    }
    /**
     * Sends a request using the proxy.
     * @param req The request being sent.
     * @param res The response for the request.
     */
    Backend.prototype.fetch = function (req, res, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, path, headers, url, requestOptions;
            return __generator(this, function (_b) {
                _a = options || {}, path = _a.path, headers = _a.headers;
                url = this.getProxyTarget(req, path);
                requestOptions = this.getProxyRequestOptions(url, req, headers);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var lib = url.protocol === 'https:' ? https_1.default : http_1.default;
                        var upstreamReq = lib.request(requestOptions, function (upstreamRes) {
                            var buf = [];
                            upstreamRes
                                .on('data', function (chunk) { return buf.push(chunk); })
                                .on('end', function () {
                                Object.entries(upstreamRes.headers)
                                    .filter(function (_a) {
                                    var _b = __read(_a, 1), name = _b[0];
                                    return !IGNORE_RESPONSE_HEADERS.includes(name.toLowerCase());
                                })
                                    .forEach(function (_a) {
                                    var _b = __read(_a, 2), name = _b[0], value = _b[1];
                                    return res.setHeader(name, value);
                                });
                                res.statusCode = upstreamRes.statusCode;
                                res.statusMessage = upstreamRes.statusMessage;
                                res.body = Buffer.concat(buf);
                                resolve();
                            });
                        });
                        upstreamReq.on('error', function (e) { return reject(new BackendFetchError_1.default(e)); });
                        upstreamReq.end(req.body);
                    })];
            });
        });
    };
    /**
     * Returns proxy configuration for http-proxy
     * @returns proxy target url
     */
    Backend.prototype.getProxyTarget = function (req, path) {
        var url = path || req.url;
        var _a = this.config, domainOrIp = _a.domainOrIp, basePath = _a.basePath, port = _a.port;
        if (basePath) {
            url = path_1.join(basePath, url);
        }
        /* istanbul ignore next */
        if (domainOrIp) {
            var protocol = domainOrIp.match(/^127.0.0.1(:\d+)?$/) ? 'http' : 'https';
            var domain = "" + domainOrIp + (port ? ":" + port : '');
            url = protocol + "://" + path_1.join(domain, url);
        }
        return url_1.parse(url, true);
    };
    /**
     * Returns proxy configuration object for node-fetch
     * @param url
     * @param req
     * @param headers Additional request headers to include
     */
    Backend.prototype.getProxyRequestOptions = function (url, req, headers) {
        var agent = null;
        if (this.config.disableCheckCert && url.protocol === 'https:') {
            // For self signed cert fix on local development S3 bucket
            agent = new https_1.default.Agent({ rejectUnauthorized: false });
        }
        return __assign(__assign({}, url), { method: req.method, timeout: this.config.firstByteTimeout || 0, agent: agent, headers: __assign(__assign(__assign({}, req.headers), headers), { host: this.config.hostHeader || req.headers.host }) });
    };
    return Backend;
}());
exports.default = Backend;
