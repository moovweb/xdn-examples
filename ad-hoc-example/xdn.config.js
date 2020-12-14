
const { join } = require('path')

module.exports = {
  connector: join(__dirname, 'xdn-entrypoints'),
  
  // Include the following files in the production bundle because sapper needs them at runtime.
  includeFiles: {
    "__sapper__/build/server/**/*": true,
    "__sapper__/build/build.json": true,
    "__sapper__/build/template.html": true,
    // Sapper will fail at startup if the static dir isn't present.
    // We just put one asset there since we actually serve the files from S3
    'static/manifest.json': true,
    // With Sapper, the service worker needs to be present in the lambda as well because
    // sapper specifically checks the file system for its presence before
    // deciding to register it in the browser
    '__sapper__/build/service-worker.js': true
  },
  
  includeNodeModules: true
}