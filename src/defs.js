import isUndefined from 'lodash/isUndefined';

class Defs {
  constructor(defaultValue) {
    this.defaultValue = defaultValue;
    this.defs = {};
  }
  add(name, val) {
    this.defs [name] = val;
    return val;
  }
  get(name) {
    if (!this.defs [name]) {
      this.defs [name] = this.defaultValue;
    }
    return this.defs [name];
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

export default Defs;
