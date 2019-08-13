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
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCaseOnly',
            },
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
