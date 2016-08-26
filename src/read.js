import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import Defs from './defs';

const defaultReader = () => {};

let readers = new Defs(defaultReader);

const read = (name, reader) => {
  if (!isString(name)) {
    throw new TypeError(`${name} must be a string.`);
  }
  if (!isUndefined(reader) &&
      !isFunction(reader)) {
    throw new TypeError(`${reader} must be a function.`);
  }
};

export default read;
