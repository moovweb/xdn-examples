"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// istanbul ignore file
var _default = [{
  key: 'next',
  name: 'Next.js',
  builder: '@xdn/next',
  addDependencies: ['@xdn/react'],
  dependency: 'next'
}, {
  key: 'angular',
  name: 'Angular',
  builder: '@xdn/angular',
  dependency: '@angular/core'
}, {
  key: 'nuxt',
  name: 'Nuxt.js',
  builder: '@xdn/nuxt',
  dependency: 'nuxt'
}];
exports.default = _default;
module.exports = exports.default;