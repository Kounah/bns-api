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

/**
 * @typedef {Object} NonSuccessStatusCodeErrorProperties
 * @property {Object} request the express request
 */
class NonSuccessStatusCodeError extends error.RequestError {
  /**
   * creates a new non-success-statuscode error
   * @param {String} address the address that returned a non success status code
   * @param {Number} statusCode the status code that was not a success status code
   * @param {NonSuccessStatusCodeErrorProperties} properties additional properties
   */
  constructor(address, statusCode, statusMessage, properties) {
    super(`non success-status code (${statusCode} ${statusMessage}) occured when loading ${address}`, {
      statusCode: 404,
      request: typeof properties == 'object' ? properties.request : null
    });
    this.requestAddress = address;
    this.requestStatusCode = statusCode;
    this.requestStatusMessage = statusMessage;
  }
}

module.exports = {
  InvalidRegionError,
  NonSuccessStatusCodeError
};