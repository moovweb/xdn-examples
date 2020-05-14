module.exports = {
  routes: './src/routes.ts',
  backends: {
    legacy: {
      domainOrIp: 'moovdemo.myshopify.com',
      hostHeader: 'moovdemo.myshopify.com',
    },
    new: {
      domainOrIp: 'www.mockaroo.com',
      hostHeader: 'www.mockaroo.com',
    },
  },
}
