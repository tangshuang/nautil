const path = require('path')
const includeFiles = [
  path.resolve(__dirname, '../animation.js'),
  path.resolve(__dirname, '../components.js'),
  path.resolve(__dirname, '../dom.js'),
  path.resolve(__dirname, '../i18n.js'),
  path.resolve(__dirname, '../index.js'),
  path.resolve(__dirname, '../stream.js'),
  path.resolve(__dirname, '../types.js'),
  path.resolve(__dirname, '../lib'),
  path.resolve(__dirname, '../demo'),
  path.resolve(__dirname, '../node_modules/ts-fns'),
]

module.exports = {
  mode: 'none',
  entry: __dirname + '/index.js',
  output: {
    filename: 'index.js',
  },
  resolve: {
    alias: {
      nautil: path.resolve(__dirname, '..'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        include: includeFiles,
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
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
  optimization: {
    minimize: false,
    usedExports: true,
    sideEffects: true,
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9000,
    historyApiFallback: true,
    before(app, server) {
      app.get('/api', function(req, res) {
        res.json({ time: Date.now() })
      })
    },
  },
}
