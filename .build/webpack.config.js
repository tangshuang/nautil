const path = require('path')
const nodeExternals = require('webpack-node-externals')

const component = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/core/component.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'component.js',
    library: 'nautil/component',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
    ],
  },
  externals: [
    nodeExternals(),
  ],
  devtool: 'source-map',
}

module.exports = [
  component,
]
