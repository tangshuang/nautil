const config = require('../webpack/basic.config')

module.exports = {
  ...config,
  entry: [
    '@babel/polyfill',
    __dirname + '/index.js'
  ],
  modules: {
    ...config.modules,
    rules: [
      ...config.modules.rules,
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
