import isUndefined from 'lodash/isUndefined';

class Impls {
  constructor() {
    this.defs = {};
  }
  add(name, val) {
    this.defs [name] = val;
    return val;
  }
  get(name) {
    return this.defs [name] || this.defs.default;
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
