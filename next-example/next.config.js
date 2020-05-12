const { withServiceWorker } = require('@xdn/next/sw');
const { nextI18NextRewrites } = require('next-i18next/rewrites');

module.exports = withServiceWorker({
  target: 'serverless',
  experimental: {
    async rewrites() {
      return [
        ...nextI18NextRewrites({
          hu: 'hu',
        }),
      ];
    },
  },
});
