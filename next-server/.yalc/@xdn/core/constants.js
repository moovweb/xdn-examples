"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * XDN configuration file name.
 */
exports.XDN_CONFIG_FILE = 'xdn.config.js';
/**
 * XDN configuration environment variable key.
 */
exports.XDN_CONFIG_ENV_VARIABLE = 'XDN_CONFIG';
/**
 * Indicates whether code is running locally or in the cloud.
 * @private
 */
exports.XDN_DEPLOYMENT_TYPE_ENV_VARIABLE = 'XDN_DEPLOYMENT_TYPE';
/**
 * Indicates that code is running in AWS.
 * @private
 */
exports.XDN_DEPLOYMENT_TYPE_AWS = 'AWS';
/**
 * CDN-as-code configuration actions
 */
exports.ACTIONS = {
    setHeader: 'set-header',
    removeHeader: 'remove-header',
    updateHeader: 'update-header',
    syntheticRes: 'synthetic-response',
    updatePath: 'update-path',
    proxy: 'proxy',
};
/**
 * The backend for cloud functions
 */
exports.BACKENDS = {
    js: '__js__',
    static: '__static__',
};
