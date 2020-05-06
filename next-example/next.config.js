const { withServiceWorker } = require('@xdn/next/sw')

module.exports = withServiceWorker({
  target: 'server'
})
