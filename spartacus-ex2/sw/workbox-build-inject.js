// Script that modifies the service-worker.js configuration using workbox-build
// Reference: https://developers.google.com/web/tools/workbox/modules/workbox-build

const { injectManifest } = require('workbox-build')

const workboxConfig = require('./workbox-config')

console.log(`Workbox configuration: `, workboxConfig)

injectManifest(workboxConfig).then(({ count, size }) => {
  console.log(
    `Generated ${workboxConfig.swDest}, which will precache ${count} files (${size} bytes)`
  )
})
