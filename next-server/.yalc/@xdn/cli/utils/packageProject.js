"use strict";

const path = require('path');

const fse = require('fs-extra');

const zip = require('./zip');

const filesize = require('filesize');

const {
  checkProjectBuilt
} = require('./xdn');

module.exports = async (absolutePath, yargs) => {
  const {
    context
  } = yargs;
  const {
    logger
  } = context;

  if (!(await checkProjectBuilt(absolutePath))) {
    throw new Error('Please build your xdn project before deploying to cloud!');
  }

  const distDir = '.xdn';
  const absoluteDistDir = path.join(absolutePath, distDir);
  return await logger.step(`📦 Packaging ${absolutePath}...`, async () => {
    logger.info('> Zipping project folder');
    const projectZip = path.join(absoluteDistDir, 'project.zip');
    await fse.remove(projectZip); // Clear old projext.zip

    await zip.zipFolder(absoluteDistDir, projectZip, {
      logger,
      dot: true
    });
    const zipSize = (await fse.stat(projectZip)).size;
    logger.info(`> Size: ${filesize(zipSize)}`);
    return projectZip;
  });
};