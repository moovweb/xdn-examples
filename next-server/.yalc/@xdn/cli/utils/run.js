"use strict";

const {
  spawn
} = require('child_process');
/**
 * Runs a command and streams the output to the console.  Takes the same arguments as child_process.spawn.
 * @param {...any} args
 * @return {Promise}
 */


module.exports = function run(...args) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(...args);
    cmd.stdout.on('data', data => process.stdout.write(data.toString('utf8')));
    cmd.stderr.on('data', data => process.stderr.write(data.toString('utf8')));
    cmd.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Process exited with code ' + code));
      }
    });
    cmd.on('error', e => reject(e));
  });
};