const createDevServer = require('@xdn/core/server/createDevServer')

module.exports = function () {
  return createDevServer({
    label: 'Sapper',
    command: () => 'npx sapper dev',
    ready: [/listening on/i],
  })
}
