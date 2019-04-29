module.exports = class PageHTML {
  /**
   * creates a new instance of the PageHTML class
   * @param {Object} properties 
   * @param {String} properties.lang
   */
  constructor(properties) {
    if(typeof properties == 'object') {
      if(typeof properties.lang == String) {
        this.lang = properties.lang;
      }
    } else throw new TypeError('properties was not an object.');
  }
};