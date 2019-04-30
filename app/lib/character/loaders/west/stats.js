const url = require('url');
const path = require('path');
const http = require('http');
const error = require('../../error');

function getAddress(b, n) {
  let p = url.parse(b);
  p.pathname = path.join(p.pathname, 'bs/character/data/abilities.json');
  p.query = {
    c: n
  };
  return url.format(p);
}

function grabData(content) {
  let o = JSON.parse(content);

  if(o.result != 'success') {
    return undefined;
  }

  let result = {
    stats: {},
    points: {}
  };

  let r = o['records'];
  
  let base = r['base_ability'];
  let equipped = r['equipped_ability'];
  let total = r['total_ability'];
  
  Object.keys(base).forEach(key => {
    result.stats[key] = {
      base: base[key],
      equipped: equipped[key],
      total: total[key]
    };
  });

  result.points = r['point_ability'];

  return result;
}

async function load(baseUrl, name) {
  return await new Promise(async (resolve, reject) => {
    let addr = getAddress(baseUrl, name);
    http.get(addr, (res) => {
      let content = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        content += chunk;
      });
      res.on('end', () => {
        if(res.statusCode == 200) {
          try {
            resolve(grabData(content));
          } catch(err) {
            reject(err);
          }
        } else reject(new error.NonSuccessStatusCodeError(addr, res.statusCode, res.statusMessage));
      });
    });
  });
}

module.exports = load;