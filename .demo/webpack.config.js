const path = require('path')
const pkg = require('../package.json')

const env = process.env.NODE_ENV

const createStylesheetLoaders = (modules) => {
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
          localIdentName: env === 'production' ? '[hash:base64]' : '[path][name]__[local]',
          localIdentHashPrefix: 'hash',
          exportLocalsConvention: 'camelCaseOnly',
          namedExport: true,
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

  if (pkg.devDependencies['less-loader']) {
    loaders.push({
      loader: 'less-loader',
      options: {
        sourceMap: true,
      },
    })
  }

  if (pkg.devDependencies['sass-loader']) {
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
        test: /\.css|less|scss$/,
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
    ],
  },
  devServer: {
    port: 9000,
    contentBase: __dirname,
  },
}
