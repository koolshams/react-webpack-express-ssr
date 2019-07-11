const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const requireFromString = require('require-from-string');
const path = require('path');
const MemoryFS = require('memory-fs');

const clientConfig = require('../webpack/dev.config.js');
const serverConfig = require('../webpack/server.config');
const outputErrors = require('./helpers/webpack-error-handler');
const startServer = require('./helpers/server');

// webpack compiler for client javascript
const clientCompiler = webpack(clientConfig);

// webpack compiler for server javascript
const fs = new MemoryFS();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = fs;

const app = express();
// static middlewares for the fonts
app.use(express.static(path.join(__dirname, '..', 'public')));
// Webpack dev/hot middlewares
app.use(
  webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath
  })
);
app.use(webpackHotMiddleware(clientCompiler));


// easy way to hot replace react code in server
const dynamicModule = {};
app.use((req, res, next) => {
  if (dynamicModule.dynamicRouter) {
    dynamicModule.dynamicRouter(req, res, next);
  } else {
    console.log('webpack build not finished');
    next();
  }
});

// Watch/Build ssr script files and run
serverCompiler.watch({ aggregateTimeout: 300 }, (error, stats) => {
  outputErrors(error, stats);
  const contents = fs.readFileSync(
    path.resolve(serverConfig.output.path, serverConfig.output.filename),
    'utf8'
  );
  const webpackModule = requireFromString(
    contents,
    serverConfig.output.filename
  );
  dynamicModule.dynamicRouter = webpackModule.ssrRouter();
  console.log('webpack server module built !!!');
});

startServer(app);
