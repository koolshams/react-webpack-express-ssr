// Webpack config for development
const path = require('path');
const webpack = require('webpack');

const assetsPath = path.resolve(__dirname, '../public/dist');

module.exports = {
  devtool: 'inline-source-map',
  target: 'web',
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr&timeout=20000',
      './src/client/client.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    publicPath: `/dist/`
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          configFile: './.babelrc'
        }
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        loader: 'url-loader?limit=10240'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // creates style nodes from JS strings
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          // translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          // compiles Sass to CSS, using Node Sass by default
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
