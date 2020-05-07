"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var install_1 = __importDefault(require("./install"));
// @ts-ignore prefetchOptions is not a standard property, but one we ask the user to expose
install_1.default(window.prefetchOptions);
