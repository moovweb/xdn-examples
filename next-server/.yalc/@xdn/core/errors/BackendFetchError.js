"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file - For some reason the constructor can't get 100% coverage on the super call */
/**
 * To be thrown when failing to connect to a backend.
 */
var BackendFetchError = /** @class */ (function (_super) {
    __extends(BackendFetchError, _super);
    /**
     * @param {Error} cause The root error emitted by http/https.request
     */
    function BackendFetchError(cause) {
        var _this = _super.call(this, cause.message) || this;
        _this.type = 'BackendFetchError';
        _this.cause = cause;
        return _this;
    }
    return BackendFetchError;
}(Error));
exports.default = BackendFetchError;
