const { withServiceWorker } = require('@xdn/next/sw')
const withXDN = require('@xdn/next/withXDN')

module.exports = withXDN(
  withServiceWorker({
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
