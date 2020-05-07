"use strict";
/* istanbul ignore file */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ensureServerStarted_1 = __importDefault(require("./ensureServerStarted"));
var reqResMapper_1 = __importDefault(require("./reqResMapper"));
var consoleWrapper_1 = __importDefault(require("./consoleWrapper"));
var http_1 = require("http");
var config_1 = __importDefault(require("../config"));
var loadRouter_1 = __importDefault(require("../router/loadRouter"));
var loadServer_1 = __importDefault(require("../server/loadServer"));
var router = loadRouter_1.default(eval('require')('./routes'));
// const server = config.getServer()
// We use 127.0.0.1 to avoid any issues that `localhost` has on Windows.
var LOCAL_HOST = '127.0.0.1';
var API_PORT = 3001;
var nextPort = 3002;
// use the bundled server in .xdn/lambda/server.js, which can either be the standard server from a package like @xdn/next, or a
// custom one created by the developer.
// let jsBackend: Server
// if (server) {
//   jsBackend = createServer(server)
//   // let the router know where to proxy next.js requests
//   router.setBackend(BACKENDS.js, {
//     domainOrIp: LOCAL_HOST,
//     port: API_PORT,
//   })
// }
var backends = config_1.default.get('backends');
var servers = [];
for (var name_1 in backends) {
    var backend = backends[name_1];
    if (backend.handler) {
        var server = http_1.createServer(loadServer_1.default(backend.handler));
        var port = nextPort++;
        Object.assign(backends, { domainOrIp: LOCAL_HOST, port: port });
        servers.push({ name: name_1, port: port, server: server });
    }
}
// Used in fetchFromAPI so that SSR pages don't call back into the lambda
// which would result in Moovweb being double-billed for each SSR request
process.env.API_HOST = LOCAL_HOST + ":" + API_PORT;
function handler(event) {
    if (event.action === 'getEdgeConfig') {
        // This is only for internal usage and is not exposed
        return Promise.resolve(router.createEdgeConfig());
    }
    else {
        var _a = reqResMapper_1.default(event), req_1 = _a.req, res_1 = _a.res, responsePromise = _a.responsePromise;
        consoleWrapper_1.default.enable();
        Promise.all(servers.map(ensureServerStarted_1.default))
            .then(function () { return router.run(req_1, res_1); })
            .finally(function () { return consoleWrapper_1.default.disable(); });
        return responsePromise;
    }
}
exports.handler = handler;
