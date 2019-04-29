const path = require('path');
const fs = require('fs');

function getPackage() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json')));
}

/**
 * sets all routes in the app
 * @param {Express.Application} app the express app
 */
function router(app) {
  app.get('/', (req, res) => {
    res.status(200)
      .set('content-type', 'text/markdown')
      .sendFile(path.join(__dirname, '../../README.md'));
  });

  app.get('/v', (req, res) => {
    res.status(200).json({
      version: getPackage()['version']
    });
  });

  app.get('/p', (req, res) => {
    res.status(200).json(getPackage());
  });
}

module.exports = {
  router
};