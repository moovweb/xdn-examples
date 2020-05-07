/// <reference types="node" />
import { RequestListener } from 'http';
/**
 * Default values applied when properties are missing from xdn.config.js.
 */
export declare const DEFAULTS: {
    production: boolean;
    backends: {};
    routes: string;
    includeNodeModules: boolean;
};
/**
 * An object containing the config settings. This class is internal, but an instance
 * can be obtained using
 * ```js
 * import Config from '@xdn/core/config'
 * ```
 * @internal
 */
declare class Config {
    private config?;
    private server?;
    /**
     * Get configuration by key
     * @param key The key to grab from the config.
     */
    get(key: string, fallback?: any): any;
    /**
     * Returns the custom server for the JS backend.
     */
    getServer(): RequestListener | undefined;
    /**
     * Sets a value for the specified key if one doesn't already exist
     * @param key A config key
     * @param value Any value
     */
    defaultTo(key: string, value: any): void;
    /**
     * Test if key exists in config
     * @param key The key to test.
     */
    has(key: string): boolean;
    /**
     * Loads XDN config and sets the current configuration.
     */
    loadXdnConfig(): void;
    /**
     * Load configuration from file
     * @private
     */
    _loadFromFile(): any;
    /**
     * Load configuration from env var
     * @private
     */
    _loadFromEnv(): any;
}
/**
 * Create a Config instance.
 */
declare const config: Config;
export default config;
