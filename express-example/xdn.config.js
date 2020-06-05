module.exports = {
  routes: './routes.js',
  server: {
    path: 'server/index.js',
  },
  backends: {
    origin: {
      domainOrIp: 'www.domain.com',
      hostHeader: 'www.domain.com',
    },
  },
}
