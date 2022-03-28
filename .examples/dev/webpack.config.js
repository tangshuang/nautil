const path = require('path')
const { DefinePlugin } = require('webpack')

const env = process.env.NODE_ENV

const createStylesheetLoaders = (modules, type) => {
  const loaders = [
    {
      loader: 'style-loader',
    },
  ]

  if (modules) {
    loaders.push({
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: env === 'production' ? '[hash:base64]' : '[local]-[path][name]',
          exportLocalsConvention: 'camelCaseOnly',
        },
        sourceMap: true,
      },
    })
  }
  else {
    loaders.push({
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    })
  }

  if (type === 'less') {
    loaders.push({
      loader: 'less-loader',
      options: {
        sourceMap: true,
      },
    })
  }

  if (type === 'sass') {
    loaders.push({
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    })
  }

  return loaders
}

module.exports = {
  mode: 'none',
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    alias: {
      'nautil': path.resolve(__dirname, '../../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /not\-css\-module/,
            use: createStylesheetLoaders(false),
          },
          {
            resourceQuery: /css\-module/,
            use: createStylesheetLoaders(true),
          },
          {
            use: createStylesheetLoaders(true),
          },
        ],
      },
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /not\-css\-module/,
            use: createStylesheetLoaders(false, 'less'),
          },
          {
            resourceQuery: /css\-module/,
            use: createStylesheetLoaders(true, 'less'),
          },
          {
            use: createStylesheetLoaders(true, 'less'),
          },
        ],
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            resourceQuery: /not\-css\-module/,
            use: createStylesheetLoaders(false, 'sass'),
          },
          {
            resourceQuery: /css\-module/,
            use: createStylesheetLoaders(true, 'sass'),
          },
          {
            use: createStylesheetLoaders(true, 'sass'),
          },
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  devServer: {
    port: 8999,
    historyApiFallback: true,
    static: {
      directory: __dirname,
    }
  },
}
