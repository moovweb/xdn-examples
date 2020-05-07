/**
 * XDN configuration file name.
 */
export declare const XDN_CONFIG_FILE = "xdn.config.js";
/**
 * XDN configuration environment variable key.
 */
export declare const XDN_CONFIG_ENV_VARIABLE = "XDN_CONFIG";
/**
 * Indicates whether code is running locally or in the cloud.
 * @private
 */
export declare const XDN_DEPLOYMENT_TYPE_ENV_VARIABLE = "XDN_DEPLOYMENT_TYPE";
/**
 * Indicates that code is running in AWS.
 * @private
 */
export declare const XDN_DEPLOYMENT_TYPE_AWS = "AWS";
/**
 * CDN-as-code configuration actions
 */
export declare const ACTIONS: {
    setHeader: string;
    removeHeader: string;
    updateHeader: string;
    syntheticRes: string;
    updatePath: string;
    proxy: string;
};
/**
 * The backend for cloud functions
 */
export declare const BACKENDS: {
    js: string;
    static: string;
};
