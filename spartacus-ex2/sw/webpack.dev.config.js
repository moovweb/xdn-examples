// DEV Webpack configuration used to build the service worker

const path = require('path')
const webpack = require('webpack')
const webBuildTargetFolder = path.join(__dirname, '..', 'dist', '__xdn__')
const targetServiceWorkerFilename = 'service-worker.js'

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    index: path.join(__dirname, 'service-worker.js'),
  },
  resolve: { extensions: ['.js', '.ts'] },
  output: {
    path: webBuildTargetFolder,
    filename: targetServiceWorkerFilename,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      XDN_PREFETCH_CACHE_NAME: 'prefetch',
      XDN_PREFETCH_HEADER_VALUE: '1',
      NODE_ENV: 'production',
    }),
  ],
}
