import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

class Funs {
  constructor(defaultFun = () => {}) {
    this.defaultFun = defaultFun;
    this.funs = {};
  }
  add(name, fun) {
    if (!isString(name)) {
      throw new TypeError(`${name} must be a string.`);
    }
    if (!isFunction(reader)) {
      throw new TypeError(`${reader} must be a function.`);
    }
    this.funs [name] = fun;
    return fun;
  }
  get(name) {
    if (!isString(name)) {
      throw new TypeError(`${name} must be a string.`);
    }
    if (!this.funs [name]) {
      this.funs [name] = this.defaultFun;
    }
    return this.funs [name];
  }
  define(name, fun) {
    if (!isUndefined(fun)) {
      return this.add(name, fun);
    }
    else {
      return this.get(name);
    }
  }
}

export default Funs;
