"use strict";
/**
 * This file is modified version of: https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/next-aws-lambda/lib/compatLayer.js
 *
 * Mods:
 * - getHeader were only able to read lower case headers, but it was able to set upper case headers as well with writeHead,
 *   so all headers are converted to lowercase now.
 *
 * - Gzippes the response on response end if matches the content-type
 *
 * - Removed variable for base64 support since we always return base64 from the lambdas.
 */
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
var gzipResponse_1 = __importDefault(require("./gzipResponse"));
var querystring_1 = __importDefault(require("querystring"));
var stream_1 = __importDefault(require("stream"));
/**
 * Gets the version of @xdn/core.  For this to work in testing an entry needed
 * to be added to moduleNameMapper in the jest config specifically for package.json
 *
 * Notes:
 * - In this module there are multiple places that need to read the XDN version.
 * But elegantly and correctly offering a single function to read XDN version is hard
 * because these different places are transpiled, bundled and invoked in different
 * contextes.
 *
 * @return {String}
 */
function getXdnVersion() {
    return require('../../package.json').version;
}
exports.default = (function (event, callback) {
    var e_1, _a, e_2, _b;
    var startTime = Date.now();
    var response = {
        body: Buffer.from(''),
        isBase64Encoded: true,
        statusCode: 200,
        multiValueHeaders: {},
    };
    var responsePromise;
    var req = new stream_1.default.Readable();
    req.url = event.path;
    var qs = '';
    if (event.multiValueQueryStringParameters) {
        qs += querystring_1.default.stringify(event.multiValueQueryStringParameters);
    }
    if (event.pathParameters) {
        var pathParametersQs = querystring_1.default.stringify(event.pathParameters);
        if (qs.length > 0) {
            qs += "&" + pathParametersQs;
        }
        else {
            qs += pathParametersQs;
        }
    }
    var hasQueryString = qs.length > 0;
    if (hasQueryString) {
        req.url += "?" + qs;
    }
    req.method = event.httpMethod;
    req.rawHeaders = [];
    req.headers = {};
    var headers = event.multiValueHeaders || {};
    try {
        for (var _c = __values(Object.keys(headers)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var key = _d.value;
            try {
                for (var _e = (e_2 = void 0, __values(headers[key])), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var value = _f.value;
                    req.rawHeaders.push(key);
                    req.rawHeaders.push(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            req.headers[key.toLowerCase()] = headers[key].toString();
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    req.getHeader = function (name) { return req.headers[name.toLowerCase()]; };
    req.getHeaders = function () { return req.headers; };
    req.connection = {};
    var res = new stream_1.default();
    Object.defineProperty(res, 'statusCode', {
        get: function () {
            return response.statusCode;
        },
        set: function (statusCode) {
            response.statusCode = statusCode;
        },
    });
    res.headers = {};
    res.writeHead = function (status, headers) {
        response.statusCode = status;
        if (headers) {
            Object.entries(headers).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                res.setHeader(name, value);
            });
        }
    };
    res.write = function (chunk) {
        response.body = Buffer.concat([
            response.body,
            Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
        ]);
    };
    res.setHeader = function (name, value) {
        res.headers[name.toLowerCase()] = value;
    };
    res.removeHeader = function (name) {
        delete res.headers[name.toLowerCase()];
    };
    res.getHeader = function (name) {
        return res.headers[name.toLowerCase()];
    };
    res.getHeaders = function () {
        return res.headers;
    };
    var onResEnd = function (callback, resolve) { return function (text) {
        if (text)
            res.write(text);
        // If request accepts a gzip response gzip it
        if ((req.getHeader('accept-encoding') || '').split(',').includes('gzip') &&
            res.getHeader('content-encoding') == null) {
            gzipResponse_1.default(res, response);
        }
        // we always respond with base64 so that we can serve non-text assets like images
        response.body = Buffer.from(response.body).toString('base64');
        response.multiValueHeaders = res.headers;
        res.writeHead(response.statusCode);
        logStatusCode(response);
        logExecutionTime(response, startTime);
        logComponentVersion(response, getXdnVersion());
        fixApiGatewayMultipleHeaders();
        if (callback) {
            callback(null, response);
        }
        else {
            resolve(response);
        }
    }; };
    if (typeof callback === 'function') {
        res.end = onResEnd(callback);
    }
    else {
        responsePromise = new Promise(function (resolve) {
            res.end = onResEnd(null, resolve);
        });
    }
    if (event.body) {
        req.push(event.body, event.isBase64Encoded ? 'base64' : undefined);
    }
    req.push(null);
    function fixApiGatewayMultipleHeaders() {
        var e_3, _a;
        try {
            for (var _b = __values(Object.keys(response.multiValueHeaders)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (!Array.isArray(response.multiValueHeaders[key])) {
                    response.multiValueHeaders[key] = [response.multiValueHeaders[key]];
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return { req: req, res: res, responsePromise: responsePromise };
});
/**
 * Adds an `x-xdn-status` header to the response based on the status code.
 *
 * Notes:
 * - If the `x-xdn-status` already exists then the status is prefixed to upstream value.
 *
 * @param response The response event
 * @private
 */
function logStatusCode(response) {
    var X_XDN_STATUS_HEADER = 'x-xdn-status';
    prefixResponseHeader(response, X_XDN_STATUS_HEADER, "w=" + response.statusCode);
}
/**
 * Adds an `x-xdn-t` header to the response based on the current time.
 *
 * Notes:
 * - If the `x-xdn-t` already exists then the execution time is prefixed to upstream value.
 *
 * @param response The response event
 * @param startTime The start time of the request
 * @private
 */
function logExecutionTime(response, startTime) {
    var endTime = Date.now();
    var lambdaTime = endTime - startTime;
    var X_XDN_T_HEADER = 'x-xdn-t';
    prefixResponseHeader(response, X_XDN_T_HEADER, "wt=" + lambdaTime);
}
/**
 * Adds an `x-xdn-components` header to the response based on the current time.
 *
 * Notes:
 * - If the `x-xdn-components` already exists then the version is prefixed to upstream value.
 *
 * @param response The response event
 * @param version The XDN version of the package
 * @private
 */
function logComponentVersion(response, version) {
    var X_XDN_COMPONENTS_HEADER = 'x-xdn-components';
    prefixResponseHeader(response, X_XDN_COMPONENTS_HEADER, "w=" + version);
}
/**
 * Sets the response header to a new value by prefixing it with the given value or,
 * if it doesn't exist, by setting it to the given value,
 *
 * @param response The response event
 * @param headerName The name of the header to prefix or set
 * @param prefixValue The value of the prefix without trailing comma
 * @private
 */
function prefixResponseHeader(response, headerName, prefixValue) {
    var headerValue = response.multiValueHeaders[headerName];
    if (headerValue) {
        if (Array.isArray(headerValue)) {
            headerValue[0] = prefixValue + "," + headerValue[0];
        }
        else {
            response.multiValueHeaders[headerName] = prefixValue + "," + headerValue;
        }
    }
    else {
        response.multiValueHeaders[headerName] = "" + prefixValue;
    }
}
