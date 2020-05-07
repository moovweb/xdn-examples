"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var merge_1 = __importDefault(require("lodash/merge"));
/**
 * Merges the provided config into package.json and writes the result to disk.
 * @param config
 * @return The resulting package.json contents as an object
 */
function addToPackageJson(contents) {
    var file = path_1.join(process.cwd(), 'package.json');
    var packageContents = JSON.parse(fs_1.readFileSync(file, 'utf8'));
    packageContents = merge_1.default(packageContents, contents);
    fs_1.writeFileSync(file, JSON.stringify(packageContents, null, 2), 'utf8');
    return packageContents;
}
exports.default = addToPackageJson;
