const url = require('url');
const path = require('path');
const http = require('http');
const JSDOM = require('jsdom').JSDOM;
const error = require('../../error');

function getAddress(b, n) {
  let p = url.parse(b);
  p.pathname = path.join(p.pathname, 'bs/character/profile');
  p.query = {
    c: n
  };
  return url.format(p);
}

/**
 * grabs the data from the html content
 * @param {String} content 
 */
function grabData(content) {
  let dom = new JSDOM(content, {
    runScripts: 'outside-only'
  });

  var querySelectorMap = {
    accountName: '#header > dl > dt > a',
    characterName: {
      selector: '#header > dl > dt > span',
      cb: function(elem) {
        return new RegExp(/^\[(.*?)\]$/).exec(elem.textContent)[1];
      }
    },
    class: '#header > dl > dd.desc > ul > li:nth-child(1)',
    level: {
      selector: '#header > dl > dd.desc > ul > li:nth-child(2)',
      cb: function(elem) {
        return new RegExp(/^Level (.*?) \u2022 HongmoonLevel (.*?)$/).exec(elem.textContent).filter(function (v, i) {
          return i != 0;
        });
      }
    },
    server: '#header > dl > dd.desc > ul > li:nth-child(3)',
    faction: '#header > dl > dd.desc > ul > li:nth-child(4)',
    clan: '#header > dl > dd.desc > ul > li.guild',
    image: {
      selector: '#contents > section > div.characterArea > div.charaterView > img',
      cb: function(elem) {
        return elem.getAttribute('src');
      }
    },
    classIcon: {
      selector: '#header > dl > dd.thumb > div > img',
      cb: function(elem) {
        return elem.getAttribute('src');
      }
    }
  };

  var result = {};
  Object.keys(querySelectorMap).forEach(key => {
    let cur = querySelectorMap[key];
    var elem;
    if(typeof cur == 'string') {
      elem = dom.window.document.querySelector(cur);
      result[key] = elem ? elem.textContent : '';
    } else if(typeof cur == 'object') {
      elem = dom.window.document.querySelector(cur.selector);
      result[key] = elem ? cur.cb(elem) : '';
    }
  });
  return result;
}

/**
 * loads the character page html
 * @param {String} baseUrl 
 * @param {String} name 
 */
async function load(baseUrl, name) {
  try {
    return await new Promise((resolve, reject) => {
      let addr = getAddress(baseUrl, name);
      http.get(addr, (res) => {
        let content = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          content += chunk;
        });
        res.on('end', () => {
          if(res.statusCode == 200) {
            resolve(grabData(content));
          } else reject(new error.NonSuccessStatusCodeError(addr, res.statusCode, res.statusMessage));
        });
      });
    });
  } catch(err) {
    throw err;
  }
}

module.exports = load;