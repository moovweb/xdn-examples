const { withServiceWorker } = require('@xdn/next/sw')
const withXDN = require('@xdn/next/withXDN')

module.exports = withXDN(
  withServiceWorker({
    i18n: {
      // These are all the locales you want to support in
      // your application
      locales: ['en-US', 'fr', 'nl-NL'],
      // This is the default locale you want to be used when visiting
      // a non-locale prefixed path e.g. `/hello`
      defaultLocale: 'en-US',
    },

    async rewrites() {
      return [
        {
          source: '/products/:id',
          destination: '/p/:id',
        },
        {
          source: process.env.BOYS_ROUTE || '/boys',
          destination: '/category/boys',
        },
        {
          source: '/boys/:slug*',
          destination: '/category/boys/:slug*',
        },
      ]
    },
  })
)
