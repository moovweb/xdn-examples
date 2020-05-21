const { Router } = require('@xdn/core/router')

module.exports = new Router().match('/', async ({ proxy, cache }) => {
  proxy('react')
})
