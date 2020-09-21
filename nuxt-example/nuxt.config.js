// This file was automatically added by xdn init.

// You should commit this file to source control.
module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/vue-placeholders.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxt/http", "@xdn/nuxt/module"],
  /*
   ** Build configuration
   */
  build: {
    standalone: true
  },
  /*
   ** Render configuration
   */
  render: {
    /*
     ** XDN already does compression:
     */
    compressor: false
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/foo/:id?",
        component: resolve(__dirname, "pages/posts/_id.vue")
      });
    }
  },

  publicRuntimeConfig: {
    http: {
      browserBaseURL: "/" // otherwise @nuxt/http will try to use 127.0.0.1 when connecting from the browser!
    }
  }
};
