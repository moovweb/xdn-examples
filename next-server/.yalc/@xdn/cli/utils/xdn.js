"use strict";

const fse = require('fs-extra');

const path = require('path');

const xdnVersionPath = absoluteNextDistDir => path.join(absoluteNextDistDir, '.xdn', 'XDN_VERSION');

exports.checkProjectBuilt = async absoluteNextDistDir => {
  return fse.pathExists(xdnVersionPath(absoluteNextDistDir));
};

exports.readXdnVersion = async absoluteNextDistDir => {
  return (await fse.readFile(xdnVersionPath(absoluteNextDistDir), 'utf8')).trim();
};