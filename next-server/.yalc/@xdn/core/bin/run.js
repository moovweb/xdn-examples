"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This module is used to run the project when no framework is detected,
 * or when the framework does not provide it's own run script. This is
 * used by the "xdn-lite" use case.
 */
var createDevServer_1 = __importDefault(require("../server/createDevServer"));
createDevServer_1.default();
