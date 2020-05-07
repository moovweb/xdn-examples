"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * The .xdn build directory
 */
exports.XDN_DIR = '.xdn';
/**
 * The destination directory for JS server code
 */
exports.JS_DIR = path_1.join(exports.XDN_DIR, 'lambda');
/**
 * The destination directory for static assets
 */
exports.ASSETS_DIR = path_1.join(exports.XDN_DIR, 's3');
/**
 * The name of the compiled routes file
 */
exports.ROUTES_FILE_NAME = 'routes.js';
