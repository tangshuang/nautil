const path = require('path')
const includeFiles = [
  path.resolve(__dirname, '../../animation.js'),
  path.resolve(__dirname, '../../components.js'),
  path.resolve(__dirname, '../../dom.js'),
  path.resolve(__dirname, '../../i18n.js'),
  path.resolve(__dirname, '../../index.js'),
  path.resolve(__dirname, '../../stream.js'),
  path.resolve(__dirname, '../../types.js'),
  path.resolve(__dirname, '../../lib'),
  path.resolve(__dirname, '../../node_modules/ts-fns'),
  path.resolve(__dirname),
]

module.exports = {
  mode: 'none',
  entry: [
    '@babel/polyfill',
    __dirname + '/index.js'
  ],
  output: {
    filename: 'index.js',
  },
  resolve: {
    alias: {
      nautil: path.resolve(__dirname, '../..'),
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
      const person = {
        name: 'tomy',
        age: 10,
      }

      app.get('/api/info', function(req, res) {
        res.json({ time: Date.now() })
      })
      app.get('/api/persons', function(req, res) {
        res.json({ ...person, id: req.query.id, time: Date.now() })
      })

      app.post('/api/persons', function(req, res) {
        const { body } = req
        Object.assign(person, body)
        res.json(body)
      })
    },
  },
}
