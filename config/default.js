const os = require('os');
const fs = require('fs');
const path = require('path');
const process = require('process');
const shell = require('shelljs');

/**
 * creates a path if it does not exist
 * @param {String} p the path
 */
function useDirectory(p) {
  if(fs.existsSync(p)) {
    return p;
  } else {
    shell.mkdir('-p', p);
    return p;
  }
}

/**
 * @typedef {Object} Config
 * @property {AppConfig} app app configuration
 * @property {ServerConfig} server server configuration
 */

/**@type {Config} */
let config = {};

// app config
/**
 * @typedef {Object} AppConfig
 * @property {Object} path
 * @property {String} path.cache
 */
/**@type {AppConfig} */
config.app = {
  path: {
    cache: useDirectory(process.argv['bnsapi_app_path_cache'] || path.join(os.tmpdir(), 'bnsapi', 'cache'))
  }
};

// server config
/**
 * @typedef {Object} ServerConfig
 * @property {Number} port the port the server listens on
 * @property {Boolean} log does the server use the log
 * @property {Boolean} logConnection does the server log connection details
 */
/**@type {ServerConfig} */
config.server = {
  port:           8080,
  log:            true,
  logConnection:  true
};

// module export
module.exports = config;