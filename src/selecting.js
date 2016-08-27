import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

let selectors = {};

// TODO wrap impl so that it validates its own output
const wrap = selector => {
  if (!isFunction(selector)) {
    throw new TypeError(`${selector} must be a function.`);
  }
  return selector;
};

const selecting = (name, selector) => {
  if (!isString(name)) {
    throw new TypeError(`${name} must be a string.`);
  }
  if (isUndefined(selector)) {
    return selectors [name] || selectors.default;
  }
  else {
    selector = wrap(selector);
    selectors [name] = selector;
    return selector;
  }
};

export default selecting;
