"use strict";

const path = require('path');

const {
  MissingPackageJsonError
} = require('./errors');

exports.loadPackageJson = givenPath => {
  const absolutePath = path.resolve(process.cwd(), givenPath);
  const packageJsonAbsolutePath = path.join(absolutePath, 'package.json');

  try {
    return require(packageJsonAbsolutePath);
  } catch (e) {
    throw new MissingPackageJsonError(`Failed to locate package.json in ${packageJsonAbsolutePath}`);
  }
};