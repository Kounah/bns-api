const url = require('url');
const path = require('path');
const http = require('http');
const JSDOM = require('jsdom').JSDOM;
const error = require('../../error');

function getAddress(b, n) {
  let p = url.parse(b);
  p.pathname = path.join(p.pathname, 'bs/character/data/equipments');
  p.query = {
    c: n
  };
  return url.format(p);
}

function grabData(content) {
  let dom = new JSDOM(content, {
    runScripts: 'outside-only'
  });

  let d = dom.window.document;

  if(d.querySelector('#equipResult').textContent != 'success') {
    return undefined;
  }

  let result = {accessory: {}, soulshield: {}};

  if(!(d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.icon > span') instanceof dom.window.Element)) {
    result.weapon = {
      name: d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.name > span').textContent,
      icon: d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.icon > p > img').getAttribute('src'),
      grade: d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.name > span').getAttribute('class'),
      data: d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.icon > p').getAttribute('item-data').split('.').map(_ => Number(_)),
      durability: {
        current: Number(d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.icon > div > span.text').textContent.split('/')[0]),
        maximum: Number(d.querySelector('#equipItems > div.wrapItem > div.wrapWeapon > div.icon > div > span.text').textContent.split('/')[1])
      },
      gems: Array.prototype.slice.call(d.querySelectorAll('#equipItems > div.wrapItem > div.wrapWeapon > div.enchant > span')).map(elem => {
        if(typeof elem == 'object' && elem instanceof dom.window.Element && typeof elem.firstChild == 'object' && elem.firstChild instanceof dom.window.Element) {
          return {
            name: elem.firstChild.getAttribute('alt'),
            icon: elem.firstChild.getAttribute('src'),
            data: elem.firstChild.getAttribute('item-data').split('.').map(_ => Number(_))
          };
        } else {
          return undefined;
        }
      })
    };
  } else {
    result.weapon = 'empty';
  }

  Array.prototype.slice.call(d.querySelectorAll('#equipItems > div.wrapItem > div.accessoryArea > div.wrapAccessory')).forEach(accessory => {
    if(typeof accessory == 'object' && accessory instanceof dom.window.Element) {
      let key = accessory.classList[1];
      let item = 'empty';
      let icon = accessory.querySelector('div.icon');
      let name = accessory.querySelector('div.name');
      if(typeof icon == 'object' && icon instanceof dom.window.Element
      && typeof name == 'object' && name instanceof dom.window.Element) {
        let iconElem = icon.querySelector('img');
        let nameElem = name.querySelector('span:not(.empty)');
        if(iconElem && nameElem) {
          item = {
            name: nameElem.textContent,
            grade: nameElem.getAttribute('class'),
            icon: iconElem.getAttribute('src'),
            data: iconElem.getAttribute('item-data').split('.').map(_ => Number(_))
          };
        } else {
          item = 'empty';
        }
      }
      result.accessory[key] = item;
    }
  });

  Array.prototype.slice.call(d.querySelectorAll('#equipItems > div.wrapGem > div > span'))
    .forEach((elem, i) => {
      if(typeof elem == 'object' && elem instanceof dom.window.Element) {
        let img = elem.querySelector('img');
        let area = d.querySelector('#equipItems > div.wrapGem > div > map > area:nth-child(' + (i + 1) + ')');
        if(typeof img == 'object' && img instanceof dom.window.Element
        && typeof area == 'object' && area instanceof dom.window.Element) {
          result.soulshield[elem.classList[0]] = {
            name: area.getAttribute('alt'),
            icon: img.getAttribute('src'),
            data: area.getAttribute('item-data').split('.').map(_ => Number(_))
          };
        } else {
          result[elem.classList[0]] = 'empty';
        }
      }
    });

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