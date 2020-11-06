const { Router } = require('@xdn/core/router')
const { angularRoutes } = require('@xdn/angular')

module.exports = new Router().use(angularRoutes)
