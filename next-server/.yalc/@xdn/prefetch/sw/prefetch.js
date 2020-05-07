"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var messageBrowser_1 = __importDefault(require("./messageBrowser"));
var constants_1 = require("../constants");
/**
 * Prefetches an asset.
 * @param url The asset URL
 * @param as The value for the link element's `as` attribute.
 *  See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link.
 *  Use "fetch" for html pages as Safari doesn't support "document".
 */
function prefetch(url, as) {
    if (as === void 0) { as = 'fetch'; }
    return messageBrowser_1.default({ action: 'prefetch', url: url, as: as });
}
exports.prefetch = prefetch;
/**
 * Returns true if the request is a prefetch, otherwise false
 * @param request
 */
function isPrefetch(request) {
    return request.headers.get(constants_1.PREFETCH_HEADER_NAME) === constants_1.PREFETCH_HEADER_VALUE;
}
exports.isPrefetch = isPrefetch;
