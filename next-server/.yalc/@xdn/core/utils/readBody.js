"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reads the request body and adds it to request.body
 * @param req
 * @return {Promise}
 */
function readBody(req) {
    return new Promise(function (resolve) {
        req.body = '';
        req.on('data', function (chunk) { return (req.body += chunk.toString()); });
        req.on('end', resolve);
    });
}
exports.default = readBody;
