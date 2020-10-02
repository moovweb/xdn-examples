module.exports = {
  apps: [{
    name: 'Shopify-App',
    script: 'yarn start:sp',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    maxMemoryRestart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    envProduction: {
      NODE_ENV: 'production'
    }
  }]
};
