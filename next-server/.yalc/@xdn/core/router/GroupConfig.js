"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupConfig = /** @class */ (function () {
    function GroupConfig(name) {
        this.name = name;
    }
    GroupConfig.prototype.byPattern = function (pattern) {
        this.pattern = pattern;
    };
    GroupConfig.prototype.toJSON = function () {
        return {
            groupedValue: this.name,
            matchRegex: this.pattern,
        };
    };
    return GroupConfig;
}());
exports.default = GroupConfig;
