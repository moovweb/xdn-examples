"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = require("path");
var DeploymentBuilder_1 = __importDefault(require("../deploy/DeploymentBuilder"));
module.exports = function init() {
    var builder = new DeploymentBuilder_1.default(process.cwd());
    builder.addDefaultAppResources(path_1.join(__dirname, '..', 'default-app'));
};
