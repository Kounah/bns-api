#!/usr/bin/env node
const server = require('../server');
const fs = require('fs');
const path = require('path');
const os = require('os');

// load config
let defaultConfigPath = path.join(__dirname, '../config/default.js');
let configPath = path.join(os.homedir(), '.bnsapirc.js');
let config;

function getDefaultConfig() {
  let defaultConfig = fs.readFileSync(defaultConfigPath).toString('utf8');
  fs.writeFileSync(configPath, defaultConfig, {
    encoding: 'utf8'
  });
  return eval(defaultConfig);
}

if(fs.existsSync(defaultConfigPath)) {
  let defaultConfigStats = fs.statSync(defaultConfigPath);
  if(defaultConfigStats.isFile()) {
    if(fs.existsSync(configPath)) {
      let configStats = fs.statSync(configPath);
      if(configStats.isFile()) {
        if(configStats.mtimeMs < defaultConfigStats.mtimeMs) {
          config = getDefaultConfig();
        } else {
          config = eval(fs.readFileSync(configPath).toString('utf8'));
        }
      } else throw new Error(`${configPath} is not a file.`);
    } else {
      config = getDefaultConfig();
    }
  } else throw new Error(`${defaultConfigPath} is not a file.`);
} else throw new Error(`${defaultConfigPath} does not exist.`);

// start
let app = server.init(config);
server.start(app);