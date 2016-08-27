import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import selection from './selection';
import mutation from './mutation';
import connection from './connection';

const subscribe = (name, args, subscriber) => {
  const selector = selecting(name);
  const selected = selector(args);
  if (isFunction(selected)) {
    const localSelector = selected;
    const unsubscribe = store.subscribe(st => subscriber(localSelector(st)));
    return unsubscribe;
  }
  else {
    
  }
};

export default subscribe;
