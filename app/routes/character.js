const character = require('../lib/character');
const error = require('../lib/error');

/**
 * handles the route for character
 * @param {Express.Application} app the express app
 */
function router(app) {
  app.get('/character/:region/:name', error.handler, async (req, res) => {
    res.status(200).json(await character.load(req.params.region, req.params.name));
  });
}

module.exports = router();