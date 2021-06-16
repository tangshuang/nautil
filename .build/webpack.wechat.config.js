const path = require('path')
const {
  // externals,
  resolve,
  module: mod,
  optimization,
} = require('./webpack.config.js')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, '../src/wechat/index.js'),
  output: {
    path: path.join(__dirname, '../dist/wechat'),
    filename: 'index.js',
    library: 'nautil/wechat',
    libraryTarget: 'commonjs2',
  },
  resolve,
  externals: [
    // ...externals,
    function(context, request, callback) {
      if (
        request.indexOf('../lib/') > -1
        && path.resolve(context, request).indexOf(path.resolve(__dirname, '../src/lib') === 0)
      ) {
        return callback(null, 'commonjs2 ../index.js')
      }
      callback(null)
    },
  ],
  module: mod,
  optimization,
}
