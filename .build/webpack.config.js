const path = require('path')
const nodeExternals = require('webpack-node-externals')

const core = {
  mode: 'none',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '..'),
    filename: 'index.js',
    library: 'nautil',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
          ],
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
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
  devtool: 'source-map',
}

module.exports = [
  core,
]
