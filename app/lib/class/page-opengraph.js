const propdef = require('../propdef');

/**
 * @typedef {Object} MediaImage
 * @property {String} url
 * @property {String} secureUrl
 * @property {String} type
 * @property {Number} width
 * @property {Number} height
 * @property {String} alt
 */

/**
 * @typedef {Object} MediaVideo
 * @property {String} url
 * @property {String} secureUrl
 * @property {String} type
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} MediaAudio
 * @property {String} url
 * @property {String} secureUrl
 * @property {String} type
 */

/**
 * @typedef {Object} Properties
 * @property {String} title REQUIRED - the opengraph title
 * @property {String} description OPTIONAL - the opengraph descriptino
 * @property {String} locale REQUIRED - the opengraph locales
 * @property {[String]} localeAlternatives OPTIONAL - opengraph locale alternatives
 * @property {[MediaImage]} image OPTIONAL - opengraph image
 * @property {[MediaVideo]} video OPTIONAL - opengraph video
 * @property {[MediaAudio]} audio OPTIONAL - opengraph audio
 */

module.exports = class PageOpengraph {
  /**
   * creates a new instance of the PageOpengraph class
   * @param {Properties} properties 
   */
  constructor(properties) {
    if(typeof properties == 'object') {
      /** @type {String} */
      this.title;
      /** @type {String} */
      this.description;
      /** @type {String} */
      this.siteName;
      /** @type {String} */
      this.locale;
      /** @type {[String]]} */
      this.localeAlternatives;
      /** @type {[MediaImage]} */
      this.image;
      /** @type {[MediaVideo]} */
      this.video;
      /** @type {[MediaAudio]} */
      this.audio;

      propdef(this, [{
        name: 'title',
        typeof: 'string',
        required: true,
      }, {
        name: 'description',
        typeof: 'string',
        required: false
      }, {
        name: 'siteName',
        typeof: 'string',
        required: false
      }, {
        name: 'locale',
        typeof: 'string',
        required: true
      }, {
        name: 'localeAlternatives',
        typeof: 'object',
        instanceof: Array,
        required: false,
      }, {
        name: 'image',
        typeof: 'object',
        instanceof: Array,
        required: false
      }, {
        name: 'video',
        typeof: 'object',
        instanceof: Array,
        required: false
      }, {
        name: 'audio',
        typeof: 'object',
        instanceof: Array,
        required: false
      }], properties);
    } else throw new TypeError('properties was not an object.');
  }
};