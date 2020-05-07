"use strict";

const {
  existsSync,
  createWriteStream
} = require('fs');

const {
  join
} = require('path');

module.exports = function addIgnore() {
  // Add `.xdn` to the gitignore file
  const ignorePath = join(process.cwd(), '.gitignore');

  if (existsSync(ignorePath)) {
    const stream = createWriteStream(ignorePath, {
      flags: 'a'
    });
    stream.write('# XDN generated build directory\n.xdn' + '\n');
    stream.end();
  }
};