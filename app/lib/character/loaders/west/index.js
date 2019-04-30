const profile = require('./profile');
const equipments = require('./equipments');
const stats = require('./stats');
const skills = require('./skills');
const traits = require('./traits');

let parts = {
  profile,
  equipments,
  stats,
  skills,
  traits
};

/**
 * loads the character
 * @param {String} baseUrl the base url of this regions server
 * @param {String} name the name of the character
 */
async function load(baseUrl, name) {
  try {
    let arr = await Promise.all(Object.keys(parts).map(key => parts[key](baseUrl, name)));
    let keys = Object.keys(parts);
    let result = {};
    arr.forEach((v, i) => {
      result[keys[i]] = v;
    });
    return result;
  } catch(err) {
    throw err;
  }
}

module.exports = load;