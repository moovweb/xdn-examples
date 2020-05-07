"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router_1 = require("./Router");
exports.Router = Router_1.default;
var CustomCacheKey_1 = require("./CustomCacheKey");
exports.CustomCacheKey = CustomCacheKey_1.default;
var ResponseWriter_1 = require("./ResponseWriter");
exports.ResponseWriter = ResponseWriter_1.default;
/**
 * We've deprecated this to simplify the API. The examples in the docs now use `new CustomCacheKey()` instead.
 * @private
 * @deprecated Use `new CustomCacheKey()` instead.
 */
var createCustomCacheKey_1 = require("./createCustomCacheKey");
exports.createCustomCacheKey = createCustomCacheKey_1.default;
