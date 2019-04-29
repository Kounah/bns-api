/**
 * @callback ValidatorFunction
 * @param {Object} property the current property
 * @returns {Boolean}
 */

/**
 * @callback ConverterFunction
 * @param {Object} obj the object to set stuff to
 * @param {PropertyDefinition} def the current definition
 * @param {Object} prop the current property
 * @returns {*}
 */

/**
 * @typedef {Object} PropertyDefinition
 * @property {String} name the name of the property
 * @property {String} typeof the type of the property (check with typeof)
 * @property {function} instanceof the instance of the property (typeof == 'object') (instanceof check)
 * @property {Boolean} required throws an error if this property is of a wrong type or not defined
 * @property {Boolean} cast if type is object and instanceof is not defined, casts, the object as the given class
 * @property {ValidatorFunction} validator a custom validator function called before all the others
 * @property {ConverterFunction} converter a custom converter function called before setting the value
 */

/**
 * handes property definition for classes
 * it will set all the properties set in prop that are listed in propdef and ensure their types
 * properties not defined in set to obj according to the setting in options.setUndefinedProperties
 * @param {Object} obj the object which properties should be set
 * @param {[PropertyDefinition]} propdef the property definitions
 * @param {Object} props the properties
 * @param {Object} options function options
 * @param {Boolean} options.setUndefinedProperties if true it will set all properties of props to obj, if false it won't
 */
function propdef(obj, propdef, props, options) {
  if(typeof obj != 'object') throw new TypeError('"obj" was not an Object.');
  if(!(typeof propdef == 'object' && propdef instanceof Array)) throw new TypeError('"propdef" was not an Array.');
  if(typeof props != 'object') throw new TypeError('"props" was not an Object.');

  propdef.forEach(def => {
    var validatorResult;
    if(typeof def.validator == 'function') {
      if(typeof (validatorResult = def.validator(props[def.name])) == 'boolean' && validatorResult) {
        // validator returned with a truthy result
      } else if(def.required) throw new TypeError(`"${def.name}" was a required property, but the validator function returned a falsy value`);
    } 

    if(typeof def.typeof == 'string' && typeof props[def.name] == def.typeof) {
      if(def.typeof == 'object' && typeof def.instanceof == 'function') {
        if(props[def.name] instanceof def.instanceof) {
          // all is fine here, it will just skip out to the point where it can end the setting
        } else if(typeof def.cast == 'function') {
          try {
            // cast, set and return afterwards
            if(typeof def.converter == 'function') {
              obj[def.name] = def.converter(obj, def, new def.cast(props[def.name]));
            } else {
              obj[def.name] = new def.cast(props[def.name]);
            }
            delete props[def.name];
            return;
          } catch (err) {
            if(def.required) {
              throw err;
            }
          }
        } if(def.required) throw new TypeError(`"${def.name}" was a required property, but it was either no object (it's type was ${typeof props[def.name]}) or it was not instance of ${def.instanceof.prototype.constructor.name}`);
      } 
    } else if(def.required) throw new TypeError(`"${def.name}" was a required property, but it's type ${typeof props[def.name]} did not match the required type ${def.typeof}`);
    
    // if anything was thrown until this point this won't be executed
    if(typeof def.converter == 'function') {
      obj[def.name] = def.converter(obj, def, props[def.name]);
    } else {
      obj[def.name] = props[def.name];
    }
    delete props[def.name];
    return;
  });

  if(typeof options == 'object' && options.setUndefinedProperties) {
    Object.keys(props).forEach(key => {
      obj[key] = props[key];
    });
  }
}

module.exports = propdef;