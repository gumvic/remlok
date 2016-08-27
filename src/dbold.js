import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import _selection from './selection';
import _mutation from './mutation';
import _connection from './connection';

class DB {
  constructor(state) {
    this.state = state;
    this.subscribers = new Set();
    this.notifyScheduled = false;
  }
  selectLocal(selector) {
    if (!selector) {
      return () => null;
    }
    else if (isFunction(selected)) {
      return () => selected(this.state);
    }
    else {
      throw new TypeError(`${selector} must be either a falsey or a function.`);
    }
  }
  select(selection, args) {
    if (isString(selection)) {
      selection = _selection(selection);
    }
    if (!isFunction(selection)) {
      throw new TypeError(`${selection} must be a function.`);
    }
    const selector = selection(args);
    if (isPlainObject(selector)) {
      const localSelector = selected.$;
      forEach(selector, (request, connection) => {
        //connection = 
      });
      return this.selectLocal(localSelector);
    }
    else {
      return this.selectLocal(selector);
    }
  }
  mutate(selection, args) {

  }
  subscribe(subscriber) {
    if (!isFunction(subscriber)) {
      throw new TypeError(`${subscriber} is not a function.`);
    }
    this.subscribers.add(subscriber);
    const unsubscribe = () => {
      this.subscribers.delete(subscriber);
    };
    return unsubscribe;
  }
  update(fun) {
    const oldState = this.state;
    const newState = fun(oldState);
    if (oldState !== newState) {
      this.state = newState;
      this.scheduleNotify();
    }
  }
  scheduleNotify() {
    if (!this.notifyScheduled) {
      setImmediate(() => this.notify);
      this.notifyScheduled = true;
    }
  }
  notify() {
    this.notifyScheduled = false;
    const subscribers = new Set(this.subscribers);
    for(const subscriber of subscribers) {
      subscriber();
    }
  }
}

const db = state =>
  new DB(state);

export default db;
