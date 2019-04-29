const EOL = require('os').EOL;
const package = require('../../package.json').name;
const process = require('process');

/**
 * converts all params to a string and joins them
 * @param  {...any} params 
 */
function paramsToString(...params) {
  return params.map(param => {
    if(typeof param === 'object') {
      return JSON.stringify(param, null, '  ').split('\n').join(EOL);
    } else return String(param);
  }).join(' ');
}

function getTimestamp() {
  return new Date().toUTCString();
}

function verbose(key, ...params) {
  if(typeof key === 'string') {
    if(typeof params === 'object' && params instanceof Array && params.length > 0) {
      process.stdout.write(`[${package}] [${getTimestamp()}] V/${key}: ${paramsToString(...params)}${EOL}`);
    } else throw new TypeError('"params" was either not an Array or its length was less than 1');
  } else throw new TypeError('"key" was not a String');
}

module.exports = {
  verbose,
  v: verbose,
};