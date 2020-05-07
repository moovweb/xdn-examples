"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_proxy_1 = __importDefault(require("http-proxy"));
var proxy = http_proxy_1.default.createProxyServer({
    changeOrigin: true,
});
/**
 * Proxies the request to the specified backend as a stream.  This can be used for event streams
 * for hot module reloading.
 * @param req The downstream request
 * @param res The downstream response
 * @param backendConfig The backend config from `xdn.config.js`
 * @param errorHandler A function to call when an error occurs
 */
function stream(req, res, backendConfig, errorHandler) {
    var protocol = backendConfig.domainOrIp === '127.0.0.1' ? 'http' : 'https';
    var config = {
        target: {
            protocol: protocol,
            host: backendConfig.domainOrIp,
            port: backendConfig.port,
        },
    };
    // @ts-ignore
    proxy.web(req, res, config, errorHandler || Function.prototype);
}
exports.default = stream;
