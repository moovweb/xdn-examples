"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * List of header regexes that will be matched against user provided header name.
 * following headers are not allowed for user to modify in any way
 */
var XDN_PROHIBITED_HEADER_NAMES = [/^x-moov-/i, /^x-xdn-/i, /^host$/i];
/**
 * Validate that prohibited header names are not overrideable by the user
 * @param name
 */
var validateProhibitedHeaderNames = function (name) {
    if (XDN_PROHIBITED_HEADER_NAMES.find(function (prohibitedRegex) { return name.match(prohibitedRegex); })) {
        throw new Error("Header \"" + name + "\" is reserved and cannot be modified");
    }
};
/**
 * Validate Set response header
 * @param name header name
 * @param value header value
 */
exports.validateSetResponseHeader = function (name /* value */) {
    validateProhibitedHeaderNames(name);
};
/**
 * Validate Update response header
 * @param name header name
 * @param match match pattern
 * @param replace replace value
 */
exports.validateUpdateResponseHeader = function (name /* match, replace */) {
    validateProhibitedHeaderNames(name);
};
/**
 * Validate Remove response header
 * @param name
 */
exports.validateRemoveResponseHeader = function (name) {
    validateProhibitedHeaderNames(name);
};
/**
 * Validate set request header
 * @param name header name
 * @param value header value
 */
exports.validateSetRequestHeader = function (name) {
    validateProhibitedHeaderNames(name);
};
/**
 * Validate Update request header
 * @param name header name
 * @param match match pattern
 * @param replace replace value
 */
exports.validateUpdateRequestHeader = function (name) {
    validateProhibitedHeaderNames(name);
};
/**
 * Validate Remove request header
 * @param name
 */
exports.validateRemoveRequestHeader = function (name) {
    validateProhibitedHeaderNames(name);
};
