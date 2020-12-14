const { createDevServer } = require('@xdn/core/dev')

module.exports = function () {
  console.log('Starting sapper app...')
  
  return createDevServer({
    label: 'Sapper',
    command: () => 'npx sapper dev',
    ready: [/listening on/i],
  })
}
