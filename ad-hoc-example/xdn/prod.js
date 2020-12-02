module.exports = async function prod(port) {
  process.env.PORT = port.toString()
  __non_webpack_require__('./__sapper__/build/server/server')
}
