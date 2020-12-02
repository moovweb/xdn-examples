/* istanbul ignore file */
const { join } = require('path')

module.exports = async function prod(port) {
  process.env.PORT = port.toString()
  eval('require')('./__sapper__/build/server/server')
}
