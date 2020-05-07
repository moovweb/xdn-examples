"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var regexp_1 = __importDefault(require("route-parser/lib/route/visitors/regexp"));
function routeToRegex(route) {
    if (route.matcher) {
        // @ts-ignore - needed because ast isn't exposed in the typings, but there nonetheless and we rely on it.
        var ast = route.matcher.ast;
        return regexp_1.default.visit(ast).re.source.replace(/\\\//g, '/');
    }
    else {
        return '.';
    }
}
exports.default = routeToRegex;
