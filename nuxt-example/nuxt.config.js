// This file was automatically added by xdn deploy.
// You should commit this file to source control.
const InjectManifestPlugin = require('@xdn/nuxt/sw/InjectManifestPlugin')

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],
  pwa: {
    workbox: {
      cachingExtensions: 'sw/service-worker.js',
    },
  },
  /*
   ** Build configuration
   */
  build: {
    plugins: [InjectManifestPlugin],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}, // eslint-disable-line no-unused-vars
  },
  /*
   ** Render configuration
   */
  render: {
    /*
     ** XDN already does compression:
     */
    compressor: false,
  },
}
