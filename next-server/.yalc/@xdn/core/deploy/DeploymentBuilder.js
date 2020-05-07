"use strict";
/* istanbul ignore file */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var child_process_1 = require("child_process");
var path_1 = require("path");
var bundle_1 = __importDefault(require("./bundle"));
var glob_1 = __importDefault(require("glob"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = __importDefault(require("../config"));
var paths_1 = require("./paths");
/**
 * The class helps you bundle apps for deployment on the Moovweb XDN.
 */
var DeploymentBuilder = /** @class */ (function () {
    function DeploymentBuilder(appDir) {
        this.appDir = appDir;
        this.xdnDir = path_1.join(this.appDir, paths_1.XDN_DIR);
        this.jsDir = path_1.join(this.appDir, paths_1.JS_DIR);
        this.staticAssetsDir = path_1.join(this.appDir, paths_1.ASSETS_DIR);
    }
    /**
     * Logs a message to the console if process.env.debug is set to true
     * @param msg The message to log
     */
    DeploymentBuilder.prototype.log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (process.env.debug === 'true') {
            console.log.apply(console, __spread(['[XDN BUILD]:'], msg));
        }
    };
    /**
     * Runs a command.
     * @param path The path to the executable
     * @param args The arguments to pass
     * @param options Options for process.spawn
     * @return {Promise}
     */
    DeploymentBuilder.prototype.exec = function (path, args, options) {
        return new Promise(function (resolve, reject) {
            var cmd = child_process_1.spawn(path, args, options);
            cmd.stdout.on('data', function (data) { return process.stdout.write(data.toString('utf8')); });
            cmd.stderr.on('data', function (data) { return process.stderr.write(data.toString('utf8')); });
            cmd.on('error', function (error) {
                reject(error);
            });
            cmd.on('exit', function (code) {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error('Process exited with code ' + code));
                }
            });
        });
    };
    /**
     * Adds an asset to the bundle for JavaScript workers
     * @param src The source path
     * @param dest The destination path within the lambda root directory
     * @return {XdnBuilder}
     */
    DeploymentBuilder.prototype.addJSAsset = function (src, dest) {
        dest = dest || path_1.basename(src);
        this.copySync(src, path_1.join(this.jsDir, dest));
        return this;
    };
    /**
     * Adds a static asset.
     * @param src The source path
     * @param dest The destination path in s3
     * @return {XdnBuilder}
     */
    DeploymentBuilder.prototype.addStaticAsset = function (src, dest) {
        dest = dest || path_1.basename(src);
        this.copySync(src, path_1.join(this.staticAssetsDir, dest));
        return this;
    };
    /**
     * Ensures all assets in the `defaultAppPath` are either already present in the user's
     * app or are copied over from `defaultAppPath`.
     * @param defaultAppPath
     * @return A self reference, suitable for chaining
     */
    DeploymentBuilder.prototype.addDefaultAppResources = function (defaultAppPath) {
        var e_1, _a;
        try {
            for (var _b = __values(glob_1.default.sync('**/*', {
                cwd: defaultAppPath,
            })), _c = _b.next(); !_c.done; _c = _b.next()) {
                var file = _c.value;
                if (!fs_extra_1.existsSync(path_1.join(this.appDir, file))) {
                    console.log("> " + chalk_1.default.green(file) + " not found, creating...");
                    this.copySync(path_1.join(defaultAppPath, file), path_1.join(this.appDir, file));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    /**
     * Copies a file
     * @param from the source path
     * @param to the destination path
     */
    DeploymentBuilder.prototype.copySync = function (from, to) {
        this.log("COPY: " + from.replace(this.appDir + '/', '') + " -> " + to.replace(this.appDir + '/', ''));
        return fs_extra_1.copySync(from, to);
    };
    /**
     * Writes a file
     * @param to the destination path
     * @param content the contents of the file
     * @param encoding the encoding
     */
    DeploymentBuilder.prototype.writeFileSync = function (to, content, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        this.log("WRITE: " + to.replace(this.appDir + '/', '') + " (" + encoding + ")");
        return fs_extra_1.writeFileSync(to, content, encoding);
    };
    /**
     * Deletes all files in a directory
     * @param dir The directory to empty
     */
    DeploymentBuilder.prototype.emptyDirSync = function (dir) {
        this.log("EMPTY: " + dir.replace(this.appDir + '/', ''));
        return fs_extra_1.emptyDirSync(dir);
    };
    /**
     * Reads a file
     * @param path the file path
     * @param options Options for `fs.readFileSync`
     * @returns The file contents
     */
    DeploymentBuilder.prototype.readFileSync = function (path, _a) {
        var _b = (_a === void 0 ? {} : _a).encoding, encoding = _b === void 0 ? 'utf8' : _b;
        this.log("READ: " + path.replace(this.appDir + '/', ''));
        return fs_extra_1.readFileSync(path, { encoding: encoding });
    };
    /**
     * Deletes a file
     * @param path The file to delete
     */
    DeploymentBuilder.prototype.removeSync = function (path) {
        this.log("DELETE: " + path.replace(this.appDir + '/', ''));
        return fs_extra_1.removeSync(path);
    };
    /**
     * Deletes the output of the previous build.
     */
    DeploymentBuilder.prototype.clearPreviousBuildOutput = function () {
        // clear .xdn directory
        this.emptyDirSync(this.xdnDir);
        return this;
    };
    /**
     * Returns the router instance.
     * @return {Router}
     */
    DeploymentBuilder.prototype.getRouter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.router) return [3 /*break*/, 2];
                        this.log('building router...');
                        _a = this;
                        return [4 /*yield*/, bundle_1.default()];
                    case 1:
                        _a.router = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.router];
                }
            });
        });
    };
    /**
     * Copies all of the standard assets into the JS and static asset bundles.  These are the same for any framework.
     */
    DeploymentBuilder.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var router, edgeConfig, destination, routes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRouter()
                        // js backend server
                    ];
                    case 1:
                        router = _a.sent();
                        // js backend server
                        if (config_1.default.has('server')) {
                            this.addJSAsset(config_1.default.get('server').path, '/server.js');
                        }
                        // lambda handler
                        this.addJSAsset(path_1.join(__dirname, '..', 'lambda', 'handler.js'));
                        // serverless config for offline test
                        this.addJSAsset(path_1.join(__dirname, '..', 'serverless.yml'));
                        // xdn.config.js
                        this.addJSAsset(path_1.join(this.appDir, 'xdn.config.js'));
                        // s3
                        process.env.XDN_EDGE_BUILD = 'true';
                        edgeConfig = router.createEdgeConfig();
                        // Copy all serveStatic assets to S3
                        for (destination in edgeConfig.destinations) {
                            routes = edgeConfig.destinations[destination].routes;
                            routes
                                .filter(function (r) { return r.route && r.route.action === 'proxy' && r.route.backend === '__static__'; })
                                .forEach(function (r) {
                                var _a;
                                var fsPath = (_a = r.route) === null || _a === void 0 ? void 0 : _a.fsPath;
                                if (!fsPath)
                                    return;
                                // Directory to look files from with recursive option
                                var globDir = fsPath
                                    .replace(/^\//, '') // remove leading slash - we are searching within the app dir, not the root
                                    .replace(/\{[^}]+\}/i, '**/*'); // replace all variables with **/* so we find all files that could possibly match
                                // s3Manifest.push({ path: r.path, file: globDir })
                                glob_1.default.sync(globDir).forEach(function (file) {
                                    _this.addStaticAsset(path_1.join(_this.appDir, file), file);
                                });
                            });
                        }
                        // .xdn/XDN_VERSION
                        this.writeFileSync(path_1.join(this.xdnDir, 'XDN_VERSION'), require('../package.json').version, 'utf8');
                        // xdn.json is not actually used by anything - we just include it here to make it easier to debug the edge logic so we have easy access to it during development.
                        this.writeFileSync(path_1.join(this.xdnDir, 'xdn.json'), JSON.stringify(edgeConfig, null, '  '), 'utf8');
                        return [4 /*yield*/, this.includeNodeModules()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds all dependencies from package.json to the JS bundle (excluding devDependencies)
     */
    DeploymentBuilder.prototype.includeNodeModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, args, lockFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(config_1.default.get('includeNodeModules', false) === true)) return [3 /*break*/, 4];
                        cmd = 'npm';
                        args = ['ci', '--production'];
                        lockFile = 'package-lock.json';
                        // yarn
                        if (fs_extra_1.existsSync(path_1.join(process.cwd(), 'yarn.lock'))) {
                            lockFile = 'yarn.lock';
                            cmd = 'yarn';
                            args = ['install', '--frozen-lockfile', '--production'];
                        }
                        this.log("Installing production dependencies using " + cmd + "...");
                        return [4 /*yield*/, this.copySync(path_1.join(this.appDir, 'package.json'), path_1.join(this.jsDir, 'package.json'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.copySync(path_1.join(this.appDir, lockFile), path_1.join(this.jsDir, lockFile))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.exec(cmd, args, { cwd: this.jsDir })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DeploymentBuilder;
}());
exports.default = DeploymentBuilder;
