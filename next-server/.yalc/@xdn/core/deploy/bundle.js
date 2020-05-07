"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var webpack_1 = __importDefault(require("webpack"));
var path_1 = require("path");
var paths_1 = require("./paths");
var loadRouter_1 = __importDefault(require("../router/loadRouter"));
var get_1 = __importDefault(require("lodash/get"));
var destDir = path_1.join(process.cwd(), paths_1.JS_DIR);
/**
 * Compiles the router in production mode.
 */
function bundle() {
    return new Promise(function (resolve, reject) {
        var routes = config_1.default.get('routes');
        // Use process.stdout.write to be able to concatenate `done.` to the same output line.
        process.stdout.write("> Bundling " + routes + "... ");
        webpack_1.default(createConfig({ mode: 'production' }), function (err, stats) {
            if (err) {
                reject(err);
            }
            else if (get_1.default(stats, 'compilation.errors.length')) {
                console.error('Errors occurred while bundling your router:', get_1.default(stats, 'compilation.errors'));
                reject(new Error('Bundling router failed.'));
            }
            else {
                process.stdout.write('done.\n');
                resolve(loadRouter_1.default(exports.ROUTER_DESTINATION));
            }
        });
    });
}
exports.default = bundle;
/**
 * Creates a webpack compiler for bundling the router in development.
 * @private
 */
function createCompiler() {
    return webpack_1.default(createConfig());
}
exports.createCompiler = createCompiler;
/**
 * Creates a webpack config for bundling the router
 * @private
 */
function createConfig(webpackConfig) {
    var routesPath = path_1.join(process.cwd(), config_1.default.get('routes'));
    var rules = [];
    try {
        // skip ts-loader if typescript is not installed in the project
        require.resolve('typescript');
        rules.push({
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        });
    }
    catch (e) { }
    try {
        // skip babel-loader if babel is not installed in the project
        require.resolve('@babel/core');
        rules.push({
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        });
    }
    catch (e) { }
    return __assign({ stats: 'errors-only', entry: {
            routes: routesPath,
        }, output: {
            filename: paths_1.ROUTES_FILE_NAME,
            path: destDir,
            libraryTarget: 'umd',
        }, module: {
            rules: rules,
        }, resolve: {
            extensions: ['.ts', '.js'],
        }, target: 'node', mode: 'development' }, webpackConfig);
}
/**
 * @private
 */
exports.ROUTER_DESTINATION = path_1.join(destDir, paths_1.ROUTES_FILE_NAME);
