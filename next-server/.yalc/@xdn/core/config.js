"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var fs_1 = require("fs");
var path_1 = require("path");
var constants_1 = require("./constants");
var Validator_1 = __importDefault(require("./utils/Validator"));
var loadServer_1 = __importDefault(require("./server/loadServer"));
/**
 * Default values applied when properties are missing from xdn.config.js.
 */
exports.DEFAULTS = {
    production: true,
    backends: {},
    routes: 'routes.js',
    includeNodeModules: false,
};
/**
 * An object containing the config settings. This class is internal, but an instance
 * can be obtained using
 * ```js
 * import Config from '@xdn/core/config'
 * ```
 * @internal
 */
var Config = /** @class */ (function () {
    function Config() {
    }
    /**
     * Get configuration by key
     * @param key The key to grab from the config.
     */
    Config.prototype.get = function (key, fallback) {
        if (this.has(key)) {
            return lodash_1.get(this.config, key);
        }
        if (fallback)
            return fallback;
        throw new Error("XDN configuration key: \"" + key + "\" is not defined");
    };
    /**
     * Returns the custom server for the JS backend.
     */
    Config.prototype.getServer = function () {
        if (!this.server) {
            var serverConfig = this.get('server', {});
            this.server = loadServer_1.default(serverConfig);
        }
        return this.server;
    };
    /**
     * Sets a value for the specified key if one doesn't already exist
     * @param key A config key
     * @param value Any value
     */
    Config.prototype.defaultTo = function (key, value) {
        if (!this.has(key)) {
            lodash_1.set(this.config, key, value);
        }
    };
    /**
     * Test if key exists in config
     * @param key The key to test.
     */
    Config.prototype.has = function (key) {
        if (!this.config)
            this.loadXdnConfig();
        return lodash_1.has(this.config, key);
    };
    /**
     * Loads XDN config and sets the current configuration.
     */
    Config.prototype.loadXdnConfig = function () {
        var file = this._loadFromFile();
        var env = this._loadFromEnv();
        this.config = lodash_1.merge({}, exports.DEFAULTS, file, env);
    };
    /**
     * Load configuration from file
     * @private
     */
    Config.prototype._loadFromFile = function () {
        var configAbsPath = path_1.join(process.cwd(), constants_1.XDN_CONFIG_FILE);
        if (fs_1.existsSync(configAbsPath)) {
            try {
                var fileConfig = eval('require')(configAbsPath);
                return Validator_1.default.validateXdnFileConfiguration(fileConfig);
            }
            catch (e) {
                throw new Error("Failed to load " + configAbsPath + ": " + e.message);
            }
        }
        return {};
    };
    /**
     * Load configuration from env var
     * @private
     */
    Config.prototype._loadFromEnv = function () {
        if (process.env[constants_1.XDN_CONFIG_ENV_VARIABLE]) {
            try {
                return JSON.parse(process.env[constants_1.XDN_CONFIG_ENV_VARIABLE]);
            }
            catch (e) {
                throw new Error("XDN configuration variable: " + constants_1.XDN_CONFIG_ENV_VARIABLE + ", is not parsable as json");
            }
        }
        return {};
    };
    return Config;
}());
/**
 * Create a Config instance.
 */
var config = new Config();
exports.default = config;
console.log('[config]', 'backends', config.get('backends'));
