/* eslint-disable import/order */
// eslint-disable-next-line import/order
// logger needs to imported first to properly patch internal nodejs objects.
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Helmet = require('helmet');
const startServer = require('./helpers/server');
const reactModule = require('../dist/server-bundle');
const assets = require('../dist/manifest.json')

const app = express();

// proper header check for basic security
app.use(Helmet());
app.use(express.static(path.join(__dirname, '..', 'public')));

// skip static files from logs
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// user ssr router
app.use(reactModule.ssrRouter(assets));

startServer(app);