"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getUserAgent_1 = __importDefault(require("./getUserAgent"));
var _isSafari = null;
function isSafari() {
    if (_isSafari == null) {
        _isSafari = /^((?!chrome|android).)*safari/i.test(getUserAgent_1.default());
    }
    return _isSafari;
}
exports.isSafari = isSafari;
/**
 * Returns true if this is a private window in safari
 * From https://stackoverflow.com/questions/12821127/how-to-check-if-ios-is-using-private-browsing/47642304#47642304
 */
function isSafariPrivateWindow() {
    if (!isSafari())
        return false;
    try {
        // @ts-ignore
        window.openDatabase(null, null, null, null);
        return false;
    }
    catch (_) {
        return true;
    }
}
exports.isSafariPrivateWindow = isSafariPrivateWindow;
