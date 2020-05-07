"use strict";

const {
  promisify
} = require('util');

const simpleGit = require('simple-git');

const status = path => {
  const git = simpleGit(path);
  return promisify(git.status.bind(git))();
};

const currentBranch = async (path, {
  logger
}) => {
  try {
    const gitStatus = await status(path);
    return gitStatus.current;
  } catch (e) {
    logger.warning(`${path} is not a git repository, using "cli" branch as fallback for now`);
    return 'cli';
  }
};

module.exports = {
  status,
  currentBranch
};