const path = require('path')
const babelConfig = require('./babel.config.js')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'index.js',
    library: 'nautil',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'ts-fns': path.resolve(__dirname, '../node_modules/ts-fns/es'),
      scopex: path.resolve(__dirname, '../node_modules/scopex'),
      tyshemo: path.resolve(__dirname, '../node_modules/tyshemo'),
      immer: path.resolve(__dirname, '../node_modules/immer'),
    },
  },
  // externals: [
  //   {
  //     react: 'react/cjs/react.production.min.js',
  //     'react/jsx-dev-runtime': 'react/cjs/react-jsx-dev-runtime.production.min.js',
  //     'react/jsx-runtime': 'react/cjs/react-jsx-runtime.production.min.js',
  //     'react-reconciler': 'react-reconciler/cjs/react-reconciler.production.min.js',
  //     scheduler: 'scheduler/cjs/scheduler.production.min.js',
  //     immer: 'immer/dist/immer.cjs.production.min.js',
  //     'ts-fns': true,
  //     tyshemo: true,
  //   },
  // ],
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
