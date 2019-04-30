const character = require('../lib/character');
const error = require('../lib/error');

/**
 * handles the route for character
 * @param {Express.Application} app the express app
 */
function router(app) {
  app.get('/character/:region/:name', error.handler, async (req, res) => {
    try {
      let data = await character(req.params.region, req.params.name);
      res.status(200).json(data);
    } catch(err) {
      error.handler(req, res, function() { throw err; });
    }
  });
}

module.exports = {
  router
};