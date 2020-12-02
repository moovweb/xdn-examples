
// This file was automatically added by xdn deploy.
// You should commit this file to source control.
module.exports = {
  dev: {
    label: 'Sapper',
    command: () => 'npx sapper dev',
    ready: [/listening on/i],
  },
  prod: require('./xdn/prod'),
  includeFiles: {
    "__sapper__/**/*": true,
    'static/manifest.json': true
  }
}
