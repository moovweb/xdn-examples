"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Replaces named parameters in the specified path with back references so
 * that the edge can create a path using the matched params with a regex replace in VCL.
 * @param matcher A route-parser route
 * @param path The request path
 * @returns A path with params replaced by back references
 */
function convertParamsToBackReferences(matcher, path) {
    var params = matcher ? findParams(matcher.ast) : [];
    params.forEach(function (param, paramIndex) {
        path = path.replace(
        // Replacing all references of param which are
        // - Not at the begining of the path
        // - Not escaped
        new RegExp("(^|[^\\\\]){" + param + "}", 'g'), function (match, capture) { return capture + "\\" + (paramIndex + 1); });
    });
    return path;
}
exports.default = convertParamsToBackReferences;
/**
 * Finds named params in a route AST
 * @param node An AST node
 * @param params
 * @return {String[]}
 * @private
 */
function findParams(node, params) {
    if (params === void 0) { params = []; }
    if (node.displayName === 'Param' || node.displayName === 'Splat') {
        params.push(node.props.name);
    }
    node.children.forEach(function (child) { return findParams(child, params); });
    return params;
}
