"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_type_1 = require("content-type");
var zlib_1 = require("zlib");
var lodash_1 = require("lodash");
/**
 * Those content types that will be gzipped are generated from the lists in:
 * our XDN v1 production Nginx + XDN v1 production Varnish + default CDN gzip policy
 */
var GZIP_TYPES = [
    'application/atom_xml',
    'application/javascript',
    'application/json',
    'application/rss+xml',
    'application/vnd.ms-fontobject',
    'application/x-font-opentype',
    'application/x-font-ttf',
    'application/x-javascript',
    'application/xhtml+xml',
    'application/xml',
    'application/xml+rss',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/svg+xml',
    'image/x-icon',
    'text/css',
    'text/html',
    'text/javascript',
    'text/js',
    'text/plain',
];
/**
 * Gzippes the response and sets the content-encoding header and returns the gzipped body when it matches the type defined above
 * Otherwise it will return the provided body without any additional header set.
 * @param res HttpResponse object
 * @param response Lambda response object
 */
var gzipResponse = function (res, response) {
    var resContentType = res.getHeader('content-type');
    // Since aws lambda holds multiValueHeaders as array convert string to array
    resContentType = lodash_1.isString(resContentType) ? [resContentType] : resContentType;
    // Return body if content-type does not exist or match the list of mimes
    if (!resContentType ||
        !GZIP_TYPES.includes(content_type_1.parse(resContentType[0]).type.toLowerCase())) {
        return;
    }
    // Set encoding header and update resposne body
    var gzippedBody = zlib_1.gzipSync(Buffer.from(response.body));
    res.setHeader('content-length', Buffer.byteLength(gzippedBody));
    res.setHeader('content-encoding', 'gzip');
    response.body = gzippedBody;
};
exports.default = gzipResponse;
