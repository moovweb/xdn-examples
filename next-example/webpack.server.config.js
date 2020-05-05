const path = require('path');

module.exports = {
  entry: `${__dirname}/server.js`,
  target: 'node',
  devtool: 'none',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  externals: {
    next: 'next',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [],
  },
};