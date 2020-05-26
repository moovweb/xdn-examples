// DEV Webpack configuration used to build the service worker

const path = require("path");
const webpack = require("webpack");
const webBuildTargetFolder = path.join(__dirname, "..", "..", "dist", "xdn-spartacus");
const targetServiceWorkerFilename = "service-worker.js";

module.exports = {
  target: "node",
  mode: "none",
  // WARNING: commented out to disable source maps
  //devtool: 'inline-source-map',
  entry: {
    index: path.join(__dirname, "service-worker.ts"),
  },
  resolve: { extensions: [".js", ".ts"] },
  output: {
    path: webBuildTargetFolder,
    filename: targetServiceWorkerFilename,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      XDN_PREFETCH_QUERY_PARAM: '__prefetch__',
      XDN_PREFETCH_CACHE_NAME: 'prefetch',
      XDN_HEADER_PREFETCH_QUERY_PARAM: '__header-prefetch__',
      PREFETCH_RESPONSE_HEADER_NAME: 'x-xdn-backend-requests',
      PREFETCH_HEADER_NAME: 'x-xdn-prefetch',
      XDN_PREFETCH_HEADER_VALUE: '1',
      NODE_ENV: 'production',
      DEEP_FETCH_HEADER_NAME: 'x-xdn-deep-prefetch'
    })
  ],
};
