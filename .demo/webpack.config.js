const path = require('path')
const pkg = require('../package.json')

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
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    alias: {
      'nautil$': path.resolve(__dirname, '../src'),
      'ts-fns$': 'ts-fns/es',
      'tyshemo$': 'tyshemo/src',
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
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
  devServer: {
    port: 9000,
    contentBase: __dirname,
  },
}
