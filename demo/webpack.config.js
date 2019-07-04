module.exports = {
  mode: 'none',
  entry: __dirname + '/index.js',
  output: {
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules\/react\-dom/,
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
