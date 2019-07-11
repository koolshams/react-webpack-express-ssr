import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

class ApiClient {
  constructor({ preProcess, formatUrl }) {
    /* eslint-disable no-return-assign */
    methods.forEach(
      method =>
        (this[method] = (path, { params, data } = {}) =>
          new Promise((resolve, reject) => {
            const request = superagent[method](formatUrl(path));

            if (params) {
              request.query(params);
            }

            if (preProcess) {
              preProcess(request);
            }

            if (data) {
              request.send(data);
            }

            request.end((err, { body } = {}) =>
              err ? reject(body || err) : resolve(body)
            );
          }))
    );
  }
}

export default ApiClient;
