import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import Impls from './impls';

let impls = new Impls();
//impls.define('default', st => null);

const connecting = (name, impl) => {
  if (!isString(name)) {
    throw new TypeError(`${name} must be a string.`);
  }
  if (!isUndefined(impl) &&
      !isFunction(impl)) {
    throw new TypeError(`${impl} must be a function.`);
  }
  return impls.define(name, impl);
};

export default connecting;
