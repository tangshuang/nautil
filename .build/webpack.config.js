const path = require('path')
const babelConfig = require('./babel.config.js')

const core = {
  mode: 'none',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'nautil.js',
    library: 'Nautil',
    libraryTarget: 'umd',
    globalObject: `typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this`,
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  },
  externals: {
    react: {
      root: 'React',
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
    },
  },
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
  devtool: 'source-map',
}

module.exports = [
  core,
]
