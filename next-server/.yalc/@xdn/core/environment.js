"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * Used to determine if the app is running in the cloud.
 * @returns `true` when running in the cloud, `false` otherwise
 */
function isCloud() {
    return process.env[constants_1.XDN_DEPLOYMENT_TYPE_ENV_VARIABLE] === constants_1.XDN_DEPLOYMENT_TYPE_AWS;
}
exports.isCloud = isCloud;
/**
 * Used to determine if the app is running on a production build.
 * @returns `true` when running a production build, either locally or in the cloud; `false` otherwise
 */
function isProductionBuild() {
    return process.env.NODE_ENV === 'production';
}
exports.isProductionBuild = isProductionBuild;
