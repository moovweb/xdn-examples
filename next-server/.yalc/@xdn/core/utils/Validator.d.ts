/**
 * An object used to validate an xdn config.
 *
 * Example:
 * ```js
 * Validator.validateXdnFileConfiguration(config)
 * ```
 */
declare class Validator {
    /**
     * Validates `xdn.config.js`. If the config is validated, it is returned; otherwise,
     * an error is thrown.
     * @param config Loaded xdn configuration
     * @returns The validated config
     */
    static validateXdnFileConfiguration(config: any): any;
}
export default Validator;
