import config from 'config';
import ApiClient from '../../common/ApiClient';

export const createClient = req =>
  new ApiClient({
    preProcess: request => {
      if (req.get('cookie')) {
        request.set('cookie', req.get('cookie'));
      }
    },
    formatUrl: path => {
      const adjustedPath = path[0] !== '/' ? `/${path}` : path;
      return `http://${config.get('api.host')}:${config.get(
        'api.port'
      )}${adjustedPath}`;
    }
  });
