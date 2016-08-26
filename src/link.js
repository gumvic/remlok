import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import Defs from './defs';

const defaultLinker = () => {};

let linkers = new Defs(defaultLinker);

const link = (name, linker) => {
  if (!isString(name)) {
    throw new TypeError(`${name} must be a string.`);
  }
  if (!isUndefined(linker) &&
      !isFunction(linker)) {
    throw new TypeError(`${linker} must be a function.`);
  }
};

export default link;
