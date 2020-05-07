"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var serveStatic_1 = __importDefault(require("../server/serveStatic"));
var port = process.env.STATIC_ASSETS_PORT || 3002;
/**
 * Launches a simple node server to serve static assets from .xdn/s3
 */
// @ts-ignore
http_1.createServer(serveStatic_1.default).listen(port, function () {
    console.log('Assets: listening on ' + port);
});
