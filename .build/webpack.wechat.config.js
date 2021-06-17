const path = require('path')
const babelConfig = require('./babel.config.js')

babelConfig.presets[0][1] = { modules: false }

const main = {
  mode: 'none',
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
      tyshemo: path.resolve(__dirname, '../node_modules/tyshemo/src'),
      immer: path.resolve(__dirname, '../node_modules/immer'),
    },
  },
  externals: {
    './wechat': true,
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: {
          test: /node_modules/,
          not: [
            /ts\-fns/,
            /tyshemo/,
          ],
        },
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          {
            loader: path.resolve(__dirname, 'wechat-exports-loader.js'),
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
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
    function(context, request, callback) {
      if (
        request.indexOf('../lib/') > -1
        && path.resolve(context, request).indexOf(path.resolve(__dirname, '../src/lib') === 0)
        && request.indexOf('/style/') === -1 // 不包含style部分
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
  externals: undefined,
}

module.exports = [main, wechat, dynamic]
