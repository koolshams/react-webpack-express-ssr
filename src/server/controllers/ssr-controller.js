import React from 'react';
import config from 'config';
import { parse as parseUrl } from 'url';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-intl-redux';
import { HelmetProvider } from 'react-helmet-async';

import createStore from '../../redux/create';
import getRoutes from '../../routes';
import { createClient } from '../helpers/client-helper';
import { loadFeedbackData, loadScoreData } from '../ssr-actions/feedback';
import { renderPage } from '../helpers/render-page';
import { handleError } from '../helpers/error-handler';

export class SSRController {
  constructor(assets) {
    this.assets = assets;
  }

  ssrHandler = async (req, res) => {
    try {
      const client = createClient(req);
      const store = createStore(client, {
        config: config.get('redux'),
      });

      const pageUrl = req.originalUrl || req.url;
      const location = parseUrl(pageUrl);
      await this._triggerActions(req, store, location);

      if (store.getState().entities.enityLoadFailed) {
        this.logger.error(
          `At least one entity failed to load while rendering the page: ${req.originalUrl}`
        );
        handleError(res, 'entity load error first');
        return;
      }

      this._renderPage(store, location, res);
    } catch (e) {
      this.logger.error(
        `An error occurred while rendering on server: ${req.url}`,
        e
      );
      handleError(res, 'error in catch');
    }
  };

  _triggerActions = async (req, store, location) => {
    const matched = matchPath(location.pathname, {
      path: '/:accountId/:orderId/:score',
      exact: false,
      strict: false
    });

    const matchedThankyou = matchPath(location.pathname, {
      path: '/:accountId/:orderId/:score/thank-you',
      exact: false,
      strict: false
    });

    if (matched) {
      await loadFeedbackData(req, store, matched, matchedThankyou);
      if (!matchedThankyou) {
        await loadScoreData(req, store, matched);
      }
    }
  };

  _renderPage = (store, location, res) => {
    const routes = getRoutes(store);
    const helmetContext = {};
    const component = (
      <HelmetProvider context={helmetContext}>
        <Provider store={store} key="provider">
          <StaticRouter location={location}>{routes}</StaticRouter>
        </Provider>
      </HelmetProvider>
    );

    const content = renderToString(component);
    const application = renderPage({
      assets: this.assets,
      content,
      helmet: helmetContext.helmet,
      store,
      brand: this.brand
    });

    res.status(200);
    res.send(application);
  };
}
