const propdef = require('./propdef');
const express = require('express');

class RequestGist {
  constructor(properties) {
    propdef(this, [{
      name: 'path',
      typeof: 'string',
      required: true
    }, {
      name: 'method',
      typeof: 'string',
      required: true
    }, {
      name: 'headers',
      typeof: 'object',
      required: true
    }, {
      name: 'params',
      typeof: 'object',
      required: false
    }, {
      name: 'query',
      typeof: 'object',
      required: false
    }, {
      name: 'body',
      typeof: 'object',
      required: false
    }, {
      name: 'file',
      typeof: 'object',
      required: false
    }, {
      name: 'files',
      typeof: 'object',
      required: false
    }], properties);
  }
}

/**
 * @typedef {Object} RequestErrorProperties
 * @property {Number} statusCode
 * @property {Object} request
 */
class RequestError extends Error {
  /**
   * creates a new request error
   * @param {String} message 
   * @param {RequestErrorProperties} properties
   */
  constructor(message, properties) {
    super(message);

    /** @type {Number} */
    this.statusCode;
    /** @type {RequestGist} */
    this.request;

    propdef(this, [{
      name: 'statusCode',
      typeof: 'number',
      required: true
    }, {
      name: 'request',
      typeof: 'object',
      instanceof: express.request,
      required: false,
      cast: RequestGist
    }], properties);
  }
}

/**
 * @typedef {("path"|"query"|"body"|"header")} MissingParameterErrorLocation
 * @typedef {Object} MissingParameterErrorProperties
 * @property {Object} request
 */
class MissingParameterError extends RequestError {
  /**
   * creates a new missing-parameter error
   * @param {String} name the name of the parameter
   * @param {MissingParameterErrorLocation} location the location of the parameter
   * @param {String} description the parameters description
   * @param {MissingParameterErrorProperties} properties additional properties
   */
  constructor(name, location, description, properties) {
    super(`the parameter "${name}" (${description}) could not be found in ${location}.`, {
      statusCode: 400,
      request: typeof properties == 'object' ? properties.request : null
    });

    /** @type {String} */
    this.paramName = name;
    /** @type {MissingParameterErrorLocation} */
    this.paramLocation = location;
    /** @type {String} */
    this.paramDescription = description;
  }
}

/**
 * @typedef {Object} MissingParameterErrorProperties
 * @property {Object} request
 */
class NotFoundError extends RequestError {
  /**
   * creates a new not-found error
   * @param {String} name
   * @param {("file"|"model")} type
   * @param {Object} criteria
   * @param {String} criteria.path
   * @param {Object} criteria.query
   */
  constructor(name, type, criteria, properties) {
    super(`The requested resource could not be found. There was no resource for ${name}:${type} matching the given criteria ${JSON.stringify(criteria, null, '')}`, {
      statusCode: 404,
      request: typeof properties == 'object' ? properties.request : null
    });
  }
}

/**
 * @typedef {Object} InternalErrorProperties
 * @property {Object} request
 */
class InternalError extends RequestError {
  /**
   * creates a new internal error
   * @param {Error|TypeError} error 
   * @param {InternalErrorProperties} properties 
   */
  constructor(error, properties) {
    if(typeof error == 'object' && error instanceof Error) {
      super('Internal Server Error', {
        statusCode: 500,
        request: typeof properties == 'object' ? properties.request : null
      });

      /** @type {Error} */
      this.error = error;
    } else throw new TypeError('"error" was not an Error');
  }
}

/**
 * handles thrown errors in the route this is used in
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Function} next 
 */
function handler(req, res, next) {
  try {
    next();
  } catch(err) {
    if(typeof err == 'object' && err instanceof Error) {
      if(err instanceof RequestError) {
        res.status(err.statusCode).json(err);
      } else {
        var _err = new InternalError(err, {
          request: req
        });
        res.status(_err.statusCode).json(_err);
      }
    }
  }
}

module.exports = {
  handler,

  RequestError,
  InternalError,
  MissingParameterError,
  NotFoundError
};