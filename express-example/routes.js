const { Router } = require('@xdn/core/router')
const { BACKENDS } = require('@xdn/core/constants')

module.exports = new Router().fallback(({ proxy }) => proxy(BACKENDS.js))
