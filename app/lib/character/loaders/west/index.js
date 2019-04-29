const async = require('async');

const profile = require('./profile');
const gear = require('./gear');
const stat = require('./stat');
const skills = require('./skills');
const traits = require('./traits');

/**
 * loads the character
 * @param {String} baseUrl the base url of this regions server
 * @param {*} name the name of the character
 */
function load(baseUrl, name) {
  async.parallel([
    profile(baseUrl, name),
    gear(baseUrl, name),
    stat(baseUrl, name),
    skills(baseUrl, name),
    traits(baseUrl, name)
  ], (res, err) => {
    if(err) {
      console.error(err);
      return;
    }

    console.log(res);
  });
}

module.exports = load;