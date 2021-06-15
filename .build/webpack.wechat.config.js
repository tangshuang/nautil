const path = require('path')
const babelConfig = require('./babel.config.js')
const { externals } = require('./webpack.config.js')

const main = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, '../src/wechat/index.js'),
  output: {
    path: path.join(__dirname, '../dist/wechat'),
    filename: 'index.js',
    library: 'nautil/wechat',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'ts-fns': 'ts-fns/es',
    },
  },
  externals: [
    ...externals,
    function(context, request, callback) {
      if (request.indexOf('../lib/') > -1) {
        return callback(null, 'commonjs2 ../index.js')
      }
      callback(null)
    },
  ],
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: true,
  },
}
module.exports = [main]
