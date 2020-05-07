"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajv_1 = __importDefault(require("ajv"));
var lodash_1 = __importDefault(require("lodash"));
var os_1 = require("os");
var constants_1 = require("../constants");
// config.backends[x] domainOrIp schema
var domainOrIpSchema = {
    $id: '/domainOrIpSchema',
    type: 'string',
};
// config.backends[x] object schema
var backendObjectSchema = {
    $id: '/backendObjectSchema',
    type: 'object',
    properties: {
        domainOrIp: {
            $ref: domainOrIpSchema.$id,
        },
        hostHeader: {
            type: 'string',
        },
        disableCheckCert: {
            type: 'boolean',
        },
        firstByteTimeout: {
            type: 'number',
        },
        basePath: {
            type: 'string',
        },
    },
    additionalProperties: true,
};
// config.backends schema
var backendSchema = {
    $id: '/backendSchema',
    type: 'object',
    patternProperties: {
        '^.*$': {
            oneOf: [{ $ref: domainOrIpSchema.$id }, { $ref: backendObjectSchema.$id }],
        },
    },
};
// xdn.config.js schema
var xdnFileConfigurationSchema = {
    $id: '/xdnFileConfigurationSchema',
    type: 'object',
    properties: {
        production: { type: 'boolean' },
        routes: { type: 'string' },
        server: {
            type: 'object',
            required: ['path'],
            properties: { path: { type: 'string' }, export: { type: 'string' } },
        },
        backends: {
            $ref: backendSchema.$id,
        },
        includeNodeModules: { type: 'boolean' },
    },
    additionalProperties: false,
    required: [],
};
var ajv = new ajv_1.default({
    allErrors: true,
    schemas: [xdnFileConfigurationSchema, backendSchema, backendObjectSchema, domainOrIpSchema],
});
/**
 * An object used to validate an xdn config.
 *
 * Example:
 * ```js
 * Validator.validateXdnFileConfiguration(config)
 * ```
 */
var Validator = /** @class */ (function () {
    function Validator() {
    }
    /**
     * Validates `xdn.config.js`. If the config is validated, it is returned; otherwise,
     * an error is thrown.
     * @param config Loaded xdn configuration
     * @returns The validated config
     */
    Validator.validateXdnFileConfiguration = function (config) {
        var errors = [];
        // the type cast on the following line is needed to get coverage to 100%.  In theory getSchema can return undefined, but it won't since we are creating the schema ourselves.
        var xdnSchemaValidator = ajv.getSchema(xdnFileConfigurationSchema.$id);
        if (lodash_1.default.has(config, 'backends.moov')) {
            // Don't allow providing moov backend in xdn.config.js
            errors.push({
                message: 'is a reserved backend name',
                // eslint-disable-next-line quotes
                dataPath: ".backends['moov']",
            });
        }
        // Don't allow providing static backend in xdn.config.js
        if (lodash_1.default.has(config, "backends." + constants_1.BACKENDS.static)) {
            errors.push({
                message: 'is a reserved backend name',
                // eslint-disable-next-line quotes
                dataPath: ".backends." + constants_1.BACKENDS.static,
            });
        }
        // Don't allow providing js backend in xdn.config.js
        if (lodash_1.default.has(config, "backends." + constants_1.BACKENDS.js)) {
            errors.push({
                message: 'is a reserved backend name',
                // eslint-disable-next-line quotes
                dataPath: ".backends." + constants_1.BACKENDS.js,
            });
        }
        // Run schema validation
        if (!xdnSchemaValidator(config)) {
            errors = __spread(errors, xdnSchemaValidator.errors);
        }
        // If errors length is not 0 throw error
        if (errors.length) {
            var errorsString = errors
                .map(function (err, i) {
                var eString = i + 1 + ") config" + err.dataPath + ": " + err.message;
                // @ts-ignore
                if (err.keyword === 'additionalProperties') {
                    // @ts-ignore
                    eString += " '" + err.params.additionalProperty + "'";
                }
                return eString;
            })
                .join(os_1.EOL);
            throw new Error("XDN configuration validation failed with errors: " + os_1.EOL + errorsString);
        }
        return config;
    };
    return Validator;
}());
exports.default = Validator;
