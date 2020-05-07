"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GroupConfig_1 = __importDefault(require("./GroupConfig"));
var Groups = /** @class */ (function () {
    function Groups() {
        this.groups = [];
        this.name = null;
    }
    Groups.prototype.group = function (name) {
        var group = new GroupConfig_1.default(name);
        this.groups.push(group);
        return group;
    };
    Groups.prototype.toJSON = function () {
        return this.groups.map(function (p) { return p.toJSON(); });
    };
    return Groups;
}());
exports.default = Groups;
