const path = require('path')

module.exports = {
  mode: 'none',
  entry: __dirname + '/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /.*/,
        loader: 'cache-loader',
        include: [
          path.resolve(__dirname, '../node_modules'),
        ],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules/react'),
          path.resolve(__dirname, '../node_modules/react-dom'),
        ],
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
    before(app, server) {
      app.get('/api', function(req, res) {
        res.json({ time: Date.now() })
      })
    },
  },
}
