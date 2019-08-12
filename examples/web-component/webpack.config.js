const config = require('../webpack/basic.config')

module.exports = {
  ...config,
  entry: [
    '@babel/polyfill',
    __dirname + '/index.js'
  ],
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.css$/,
        use: [
          {
            loader: __dirname + '/css-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    ...config.devServer,
    contentBase: __dirname,
  },
}
