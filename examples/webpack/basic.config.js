const path = require('path')

// files in this list should be es6 module and will be transform by babel
const rootDir = __dirname + '/../../'
const includeFiles = [
  path.resolve(rootDir, 'animation.js'),
  path.resolve(rootDir, 'components.js'),
  path.resolve(rootDir, 'dom.js'),
  path.resolve(rootDir, 'i18n.js'),
  path.resolve(rootDir, 'index.js'),
  path.resolve(rootDir, 'stream.js'),
  path.resolve(rootDir, 'types.js'),
  path.resolve(rootDir, 'lib'),
  path.resolve(rootDir, 'ui.js'),
  path.resolve(__dirname, '..'),
  path.resolve(rootDir, 'node_modules/ts-fns/src'),
  path.resolve(rootDir, 'node_modules/storagex/src'),
  path.resolve(rootDir, 'node_modules/tyshemo/src'),
  path.resolve(rootDir, 'node_modules/rxjs/_esm2015'),
]
const webpack = require('webpack')

module.exports = {
  mode: 'none',
  output: {
    filename: 'index.js',
  },
  resolve: {
    alias: {
      // use es6 source code for tree shaking
      'nautil': path.resolve(rootDir),
      'ts-fns': 'ts-fns/src/index.js',
      'storagex': 'storagex/src/storagex.js',
      'tyshemo': 'tyshemo/src/index.js',
      'rxjs': 'rxjs/_esm2015/index.js',
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
            ['@babel/preset-env', {
              modules: false,
              // exclude: ['@babel/plugin-transform-classes'],
            }],
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
    // contentBase: __dirname,
    compress: true,
    port: 9000,
    historyApiFallback: true,
    before(app, server) {
      const person = {
        name: 'tomy',
        age: 10,
      }
      const parse = (stream) => {
        return new Promise((resolve, reject) => {
          let data = ''
          stream.on('data', (chunk) => {
            data += chunk.toString()
          })
          stream.on('end', () => resolve(data))
          stream.on('error', reject)
        })
      }

      app.get('/api/info', function(req, res) {
        res.json({ time: Date.now() })
      })
      app.get('/api/persons', function(req, res) {
        res.json({ ...person, id: req.query.id, time: Date.now() })
      })

      app.post('/api/persons', async function(req, res) {
        const body = await parse(req)
        const json = JSON.parse(body)
        Object.assign(person, json)
        res.json(body)
      })
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}
