"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/**
 * Base class for a router plugin.
 */
var PluginBase = /** @class */ (function () {
    function PluginBase() {
    }
    /**
     * Called when plugin is registered
     * @param router The router object to which the plugin was added.
     */
    PluginBase.prototype.onRegister = function (router) { };
    /**
     * Called when `router.run` receives a request.
     * @param req The request object
     */
    PluginBase.prototype.onRequest = function (req) { };
    return PluginBase;
}());
exports.default = PluginBase;
