"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var SERVER_NAME = 'server.js';
/**
 * Loads the server at {cwd}/server.js.
 * @param serverConfig The server config object from xdn.config.js with optional "export" property.
 */
function loadServer(serverConfig) {
    var serverPath = path_1.join(process.cwd(), SERVER_NAME);
    if (fs_1.existsSync(serverPath)) {
        var server = eval('require')(serverPath);
        if (serverConfig && serverConfig.export) {
            server = server[serverConfig.export]();
        }
        else if (server.default) {
            server = server.default;
        }
        return server;
    }
}
exports.default = loadServer;
