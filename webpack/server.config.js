const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
module.exports = {
  context: path.resolve(__dirname, '..', 'src'),
  entry: './server/index.js',
  mode: isDev ? 'development' : 'production',
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'server-bundle.js',
    publicPath: '/dist/',
    libraryTarget: 'commonjs'
  },
  optimization: {
    minimize: false
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: 'url-loader?limit=10240'
      },
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(c|sc)ss$/,
        loader: 'ignore-loader'
      }
    ]
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: isDev
    })
  ]
};
