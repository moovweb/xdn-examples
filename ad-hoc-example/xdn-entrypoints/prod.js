module.exports = async function prod(port) {
  process.env.PORT = port.toString()
  require('../__sapper__/build/server/server')
}
