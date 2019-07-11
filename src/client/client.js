/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'regenerator-runtime/runtime';
import 'core-js/features/map';
import 'core-js/features/set';
import 'core-js/features/promise';
import 'core-js/features/object';
import 'core-js/features/array';
import 'core-js/features/symbol';

import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserHistory } from 'history';
import createStore from './redux/create';
import ApiClient from './common/ApiClient';
import getRoutes from './routes';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

const client = new ApiClient({
  formatUrl: path => {
    const adjustedPath = path[0] !== '/' ? `/${path}` : path;
    return `/api${adjustedPath}`;
  },
  preProcess: request => {
    const { pathname, search } = window.location;
    request.set('x-referer', `${pathname}${search}`);
  }
});

const dest = document.getElementById('content');
const store = createStore(client, window.__data);
const history = createBrowserHistory();

const component = <Router history={history}>{getRoutes(store)}</Router>;

hydrate(
  <ErrorBoundary>
    <HelmetProvider>
      <Provider store={store} key="provider">
        {component}
      </Provider>
    </HelmetProvider>
  </ErrorBoundary>,
  dest
);
