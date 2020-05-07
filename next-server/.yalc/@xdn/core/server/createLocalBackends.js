"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var loadServer_1 = __importDefault(require("./loadServer"));
var http_1 = require("http");
exports.LOCAL_HOST = '127.0.0.1';
function createLocalBackends(startingPort) {
    var servers = [];
    var backends = config_1.default.get('backends');
    for (var name_1 in backends) {
        var backend = backends[name_1];
        if (backend.handler) {
            var server = http_1.createServer(loadServer_1.default(backend.handler));
            var port = startingPort++;
            Object.assign(backend, { domainOrIp: exports.LOCAL_HOST, port: port });
            console.log('[createLocalBackends]', 'backends', backends);
            servers.push({ name: name_1, port: port, server: server });
        }
    }
    return servers;
}
exports.default = createLocalBackends;
