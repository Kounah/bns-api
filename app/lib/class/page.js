const express = require('express');

const PageHTML = require('./page-html');
const PageOpengraph = require('./page-opengraph');

const propdef = require('../propdef');

/**
 * what parameters can be used in templates
 */
class Page {
  /**
   * creates a new page object
   * @param {Object} properties the properties to intitialize a ne page with
   * @param {String} properties.title the title of the page
   * @param {express.request} properties.req the express request for the route
   * @param {express.response} properties.res the express response for the route
   * @param {PageHTML} properties.html the settings for the delivered html
   * @param {PageOpengraph} properties.opengraph the opengraph settings for the delivered html
   */
  constructor(properties) {
    propdef(this, [
      {
        name: 'title',
        typeof: 'string',
        required: true
      }, {
        name: 'req',
        typeof: 'object',
        instanceof: express.request,
        required: true,
      }, {
        name: 'res',
        typeof: 'object',
        instanceof: express.result,
        required: true
      }, {
        name: 'html',
        typeof: 'object',
        cast: PageHTML,
        required: false
      }, {
        name: 'opengraph',
        typeof: 'object',
        cast: PageOpengraph,
        required: false,
      }
    ], properties);
  }
}

module.exports = Page;