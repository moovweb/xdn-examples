# To build this project:

```
yarn
yarn build:core
yarn build:sp
yarn dev:sp
```

The Nuxt app is located in packages/shopify/theme

Here's what I've needed to do so far to get it running on the XDN:

## nuxt.config.js changes

- Migrate to ES5 by replacing import with require and export default with module.exports
- Remove build modules:

```
  build: {
    transpile: ["vee-validate/dist/rules"],
    plugins: [
      // new webpack.DefinePlugin({
      //   "process.VERSION": JSON.stringify({
      //     // eslint-disable-next-line global-require
      //     version: require("./package.json").version,
      //     lastCommit: process.env.LAST_COMMIT || ""
      //   })
      // })
    ]
  },
```

and 

```
  plugins: ["./plugins/shopify.js"],
  // buildModules: [
  //   // to core
  //   "@nuxt/typescript-build",
  //   "@nuxtjs/dotenv",
  //   ["@nuxtjs/pwa", { icon: false }],
  //   [
  //     "@vue-storefront/nuxt",
  //     {
  //       coreDevelopment: true,
  //       useRawSource: {
  //         dev: ["@vue-storefront/shopify", "@vue-storefront/core"],
  //         prod: ["@vue-storefront/shopify", "@vue-storefront/core"]
  //       }
  //     }
  //   ],
  //   [
  //     "@vue-storefront/nuxt-theme",
  //     {
  //       apiClient: "@vue-storefront/shopify-api",
  //       composables: "@vue-storefront/shopify"
  //     }
  //   ]
  // ],
  modules: [
```

## package.json changes:

Add the following as dependencies:

```
  "dependencies": {
    "lozad": "^1.15.0",
    "nuxt-start": "^2.13.3",
    "@glidejs/glide": "^3.4.1",
    "@nuxtjs/robots": "^2.4.2",
    "@vue/composition-api": "^1.0.0-beta.6",
    "body-scroll-lock": "^3.0.3",
    "cookie-universal-nuxt": "^2.1.4",
    "nuxt-i18n": "^6.13.1",
    "shopify-buy": "^2.11.0",
    "simplebar-vue": "^1.5.1",
    "vee-validate": "^3.3.7",
    "vue": "^2.6.11",
    "vue-scrollto": "^2.18.1"
  }
```
