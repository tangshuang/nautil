const path = require('path')
const babelConfig = require('./babel.config.js')

const main = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.join(__dirname, '../miniprogram_dist'),
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
  externals: [
    {
      react: true,
      // react: 'react/cjs/react.production.min.js',
      // 'react/jsx-dev-runtime': 'react/cjs/react-jsx-dev-runtime.production.min.js',
      // 'react/jsx-runtime': 'react/cjs/react-jsx-runtime.production.min.js',
      // 'react-reconciler': 'react-reconciler/cjs/react-reconciler.production.min.js',
      // scheduler: 'scheduler/cjs/scheduler.production.min.js',
      // immer: 'immer/dist/immer.cjs.production.min.js',
      // 'ts-fns': true,
      // tyshemo: true,
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

const wechat = {
  ...main,
  entry: path.resolve(__dirname, '../src/wechat/index.js'),
  output: {
    path: path.join(__dirname, '../miniprogram_dist/wechat'),
    filename: 'index.js',
    library: 'nautil/wechat',
    libraryTarget: 'commonjs2',
  },
  externals: [
    ...main.externals,
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
}

const dynamic = {
  ...main,
  entry: path.resolve(__dirname, '../src/wechat/components/dynamic/dynamic.js'),
  output: {
    path: path.join(__dirname, '../miniprogram_dist/wechat/components/dynamic'),
    filename: 'dynamic.js',
    libraryTarget: 'commonjs2',
  },
}

module.exports = [main, wechat, dynamic]
