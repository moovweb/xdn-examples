"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = require("zlib");
/**
 * Replaces response.body with the unzipped body if the response has
 * a content-encoding: gzip header.  Will remove the content-encoding header
 * if present.  If content-encoding: gzip is not present, this method does nothing.
 * @param response
 */
function unzip(response) {
    var _a;
    if (((_a = response.getHeader('content-encoding')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'gzip' &&
        response.body instanceof Buffer) {
        response.removeHeader('content-encoding');
        response.body = zlib_1.gunzipSync(response.body);
    }
}
exports.default = unzip;
