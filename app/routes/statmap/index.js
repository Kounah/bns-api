const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const error = require('../../lib/error');

const dir = path.join(__dirname, './maps');

/**
 * handles routes for statmap
 * @param {Express.Application} app
 */
function router(app) {
  app.get('/statmap/:region', error.handler, (req, res) => {
    if(req.params.region) {
      let maps = fs.readdirSync(dir).map(file => {
        var p = path.join(dir, file);
        var pp = path.parse(p);
        if(pp.ext == '.json') {
          return JSON.parse(fs.readFileSync(p).toString('utf8'));
        } else if(pp.ext == '.yaml' || pp.ext == '.yml') {
          return YAML.parse(fs.readFileSync(p).toString('utf8'));
        } else return undefined;
      }).filter(map => typeof map == 'object');
      if(maps.length > 0) {
        res.status(200).json(maps[Number(req.query.index) || 0]);
      } else throw new error.NotFoundError(`statmap for region '${req.params.region}'`, 'file', {
        path: path.relative(__dirname, dir),
        query: req.query
      });
    } else throw new error.MissingParameterError('region', 'path', 'the region for this statmap');
  });
}

module.exports = {
  router
};