const config = require('config');

module.exports = (app) => {
  const server = app.listen(config.get('client.port'), err => {
    if (err) {
      console.error('Error starting server: ', err);
    }
    console.log(
      `----\n==> ✅  Your digital receipt (${
        process.env.NODE_ENV
      }) is running, talking to API server on ${config.get('api.port')}.`
    );
    console.log(
      `==> 💻  Open http://${config.get('client.host')}:${config.get(
        'client.port'
      )} in a browser to view the app.`
    );
  });

  // kill server fast
  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0);
    });
  });
};
