import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import Defs from './defs';

const defaultMutator = () => {};

let mutators = new Defs(defaultMutator);

const mutation = (name, mutator) => {
  if (!isString(name)) {
    throw new TypeError(`${name} must be a string.`);
  }
  if (!isUndefined(mutator) &&
      !isFunction(mutator)) {
    throw new TypeError(`${mutator} must be a function.`);
  }
};

export default mutation;
