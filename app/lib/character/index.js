const config = require('./config');
const error = require('./error');

/**
 * loads the character profile
 * @param {String} region the region the player plays at
 * @param {String} name   the name of the character
 */
async function load(region, name) {
  if(typeof config == 'object') {
    /**@type {config.Region} */
    let handler = config[region];
    if(typeof handler == 'object') {
      try {
        return await handler.loader(handler.baseUrl, name);
      } catch(err) {
        throw err;
      }
    } else throw new error.InvalidRegionError(region);
  } else throw new TypeError('"config" is not an Object.');
}

module.exports = load;