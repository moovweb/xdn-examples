const { createDevServer } = require('@xdn/core/dev')

module.exports = function () {
  return createDevServer({
    label: 'Sapper',
    command: () => 'npx sapper dev',
    ready: [/listening on/i],
  })
}
