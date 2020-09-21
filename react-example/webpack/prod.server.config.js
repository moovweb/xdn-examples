const path = require('path')

module.exports = {
  target: 'node',
  entry: {
    server: './xdn/server.js',
  },
  devtool: 'none',
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}
