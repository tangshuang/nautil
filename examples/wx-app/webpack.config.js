// https://github.com/wechat-miniprogram/kbone/blob/develop/docs/quickstart.md

const config = require('../webpack/basic.config')
const path = require('path')
const mpconfig = require('./mp-config')
const child_process = require('child_process')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MpPlugin = require('mp-webpack-plugin') // 用于构建小程序代码的 webpack 插件

// 起一个本地服务器，用来作为后台数据请求
child_process.spawn('node', [path.resolve(__dirname, 'server.js')])

module.exports = {
  ...config,
  entry: [
    __dirname + '/polyfills.js',
    '@babel/polyfill',
    __dirname + '/index.js'
  ],
  output: {
    path: path.resolve(__dirname, './miniprogram/common'),
    filename: '[name].js',
    library: 'createApp', // 必需字段，不能修改
    libraryExport: 'default', // 必需字段，不能修改
    libraryTarget: 'window', // 必需字段，不能修改
  },
  target: 'web', // 必需字段，不能修改
  optimization: {
    runtimeChunk: false, // 必需字段，不能修改
    splitChunks: { // 代码分割配置，不建议修改
      chunks: 'all',
      minSize: 1000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '-',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        }
      }
    },
  },
  module: {
    ...config.module,
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, '../../node_modules/react'),
        ],
        options: {
          presets: [
            '@babel/preset-react',
          ],
          plugins: [
            'react-require',
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
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
  plugins: [
    ...config.plugins,
    new MiniCssExtractPlugin({
      filename: '[name].wxss',
    }),
    new MpPlugin(mpconfig),
  ],
}
