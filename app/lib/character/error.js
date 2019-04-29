const error = require('../error');

/**
 * @typedef {Object} InvalidRegionErrorProperties
 * @property {Object} request
 */
class InvalidRegionError extends error.RequestError {
  /**
   * creates a new invalid-region error
   * @param {String} region
   * @param {InvalidRegionErrorProperties} properties
   */
  constructor(region, properties) {
    super(`There is no handler specified for region "${region}"`, {
      request: typeof properties == 'object' ? properties.request : null,
      statusCode: 400
    });
    this.region = region;
  }
}

module.exports = {
  InvalidRegionError
};