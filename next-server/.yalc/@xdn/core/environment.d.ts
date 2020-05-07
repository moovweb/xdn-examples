/**
 * Used to determine if the app is running in the cloud.
 * @returns `true` when running in the cloud, `false` otherwise
 */
export declare function isCloud(): boolean;
/**
 * Used to determine if the app is running on a production build.
 * @returns `true` when running a production build, either locally or in the cloud; `false` otherwise
 */
export declare function isProductionBuild(): boolean;
