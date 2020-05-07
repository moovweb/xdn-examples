"use strict";
/*
 * Wrap the console logging functions with 'pino' JSON logger
 * when we are running as a lambda
 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var awsCloudWatchTag = { awsTag: 'userLogs' };
var environment = require('../environment');
var util = require('util');
var pinoJsonLogger = require('pino')({ base: awsCloudWatchTag });
// The following console function write to stdout,
// but we do not support them when running as Lambda.
// console.count
// console.countReset
// console.dirxml
// console.group
// console.table
// Because the enable() and disable() functions can
// be called multiple, overlapping times, we need to
// put these two variables into a global.
// istanbul ignore else
if (!global._xdnOriginalConsole) {
    global._xdnOriginalConsole = {
        assert: console.assert,
        debug: console.debug,
        dir: console.dir,
        error: console.error,
        info: console.info,
        log: console.log,
        time: console.time,
        timeEnd: console.timeEnd,
        timeLog: console.timeLog,
        trace: console.trace,
        warn: console.warn,
    };
    global._xdnEnabledCount = 0;
}
var _timers = {};
var _logger = pinoJsonLogger;
var ConsoleWrapper = /** @class */ (function () {
    function ConsoleWrapper(mockLogger) {
        if (mockLogger) {
            _logger = mockLogger;
        }
        _timers = {};
    }
    ConsoleWrapper._assert = function (condition) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!condition) {
            console.info.apply(console, __spread(args));
        }
    };
    ConsoleWrapper._dir = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info(util.inspect.apply(util, __spread(args)));
    };
    ConsoleWrapper._trace = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error('Trace:', util.format.apply(util, __spread(args)));
        // @ts-ignore Needed to get coverage to 100% - Error.stack can be undefined in theory, but not in practice
        console.error(Error().stack.replace(/Error\n/, '')); // mimic the behavior of console.trace and do not output 'Error'
    };
    ConsoleWrapper._time = function (label) {
        _timers[label] = Date.now();
    };
    ConsoleWrapper._timeEnd = function (label) {
        ConsoleWrapper._timeLog(label);
    };
    ConsoleWrapper._timeLog = function (label) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!_timers[label]) {
            console.warn("Warning: No such label '" + label + "' for console.timeEnd()");
            return;
        }
        var deltaTime = Date.now() - _timers[label];
        _timers[label] = Date.now();
        console.info.apply(console, __spread([label + ": " + deltaTime + "ms"], args));
    };
    ConsoleWrapper.enable = function () {
        if (!environment.isCloud()) {
            return;
        }
        if (global._xdnEnabledCount === 0) {
            _timers = {};
            console.assert = ConsoleWrapper._assert;
            console.debug = _logger.debug.bind(_logger);
            console.dir = ConsoleWrapper._dir;
            console.error = _logger.error.bind(_logger);
            console.info = _logger.info.bind(_logger);
            console.log = _logger.info.bind(_logger);
            console.time = ConsoleWrapper._time;
            console.timeEnd = ConsoleWrapper._timeEnd;
            console.timeLog = ConsoleWrapper._timeLog;
            console.trace = ConsoleWrapper._trace;
            console.warn = _logger.warn.bind(_logger);
        }
        global._xdnEnabledCount++;
    };
    ConsoleWrapper.disable = function () {
        if (!environment.isCloud()) {
            return;
        }
        global._xdnEnabledCount--;
        if (global._xdnEnabledCount === 0) {
            console.assert = global._xdnOriginalConsole.assert;
            console.debug = global._xdnOriginalConsole.debug;
            console.dir = global._xdnOriginalConsole.dir;
            console.error = global._xdnOriginalConsole.error;
            console.info = global._xdnOriginalConsole.info;
            console.log = global._xdnOriginalConsole.log;
            console.time = global._xdnOriginalConsole.time;
            console.timeEnd = global._xdnOriginalConsole.timeEnd;
            console.timeLog = global._xdnOriginalConsole.timeLog;
            console.trace = global._xdnOriginalConsole.trace;
            console.warn = global._xdnOriginalConsole.warn;
        }
    };
    return ConsoleWrapper;
}());
exports.default = ConsoleWrapper;
