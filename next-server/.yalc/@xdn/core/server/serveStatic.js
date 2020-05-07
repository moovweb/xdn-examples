"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var mime_types_1 = __importDefault(require("mime-types"));
var decode_uri_component_1 = __importDefault(require("decode-uri-component"));
/**
 * Serves assets in local development.
 * @private
 * @param req
 * @param res
 */
function serveStatic(req, res) {
    try {
        var path = req.url.split(/\?/)[0].slice(1);
        var file = path_1.join(process.cwd(), '.xdn', 's3', decode_uri_component_1.default(path));
        if (fs_1.default.existsSync(file)) {
            res.setHeader('Content-Type', mime_types_1.default.lookup(path_1.basename(file)));
            res.setHeader('Content-Length', fs_1.default.statSync(file).size);
            // @ts-ignore TS is unhappy with res being our Response instead of ServerResponse - we do this to limit what the user can do with a response to what is actually possible with the XDN vs what would be possible with vanilla node.
            fs_1.default.createReadStream(file).pipe(res);
        }
        else {
            res.writeHead(404);
            res.end();
        }
    }
    catch (e) {
        res.writeHead(500);
        res.end();
    }
}
exports.default = serveStatic;
