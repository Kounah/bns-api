const loaders = require('./loaders');

/**
 * @callback LoaderCallback
 * @param {String} region the region the player is in
 * @param {String} name the name of the character
 * @param {String} baseUrl the base url of the regions server
 * @returns {Promise} regional character
 */

/**
 * @typedef {Object} Region
 * @property {String} baseUrl the base url of this regions bns ingame server
 * @property {LoaderCallback} loader the loader handling the requests
 */

/**@type {Region} */
let eu = {
  baseUrl: 'http://eu-bns.ncsoft.com/ingame',
  loader: loaders.west
};
/**@type {Region} */
let na = {
  baseUrl: 'http://na-bns.ncsoft.com/ingame',
  loader: loaders.west
};
/**@type {Region} */
let kr = {
  baseUrl: 'http://bns.plaync.com/ingame',
  loader: loaders.kr
};

module.exports = {
  eu,
  na,
  kr
};