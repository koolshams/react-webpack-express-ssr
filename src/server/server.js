/* eslint-disable import/first */
import 'regenerator-runtime/runtime';
import express from 'express';

import '../intl/loadLocaleData';
import { SSRController } from './controllers/ssr-controller';
import { reportErrorMiddleware } from './middlewares/report-error';

export const ssrRouter = (assets) => {
  const router = express.Router();

  const ssrController = new SSRController(assets);
  router.post('/report-error', express.json());
  router.post('/report-error', reportErrorMiddleware());
  router.get('*', ssrController.ssrHandler);
  return router;
};
