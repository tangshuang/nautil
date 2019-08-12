const path = require('path')
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
  path.resolve(__dirname, '..'),
]

module.exports = {
  mode: 'none',
  // entry: [
  //   '@babel/polyfill',
  //   __dirname + '/index.js'
  // ],
  output: {
    filename: 'index.js',
  },
  resolve: {
    alias: {
      nautil: path.resolve(rootDir),
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
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: true,
      //       },
      //     },
      //   ],
      // },
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
}
