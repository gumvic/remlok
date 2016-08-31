import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import conformsTo from 'lodash/conformsTo';

const optsShape = {
  selector: isFunction,
  dispatcher: isFunction
};

const promiseShape = {
  then: isFunction
};

const noParent = {
  select(query) {}
  dispatch(msg) {}
  subscribe(callback) {}
};

class Store {
  constructor(opts) {
    if (!conformsTo(opts, optsShape)) {
      throw new TypeError(`${opts} TODO`);
    }
    const { select, dispatch, state } = opts;
    this.selectf = select;
    this.dispatchf = dispatch;
    this.state = state;
    this.subscribers = new Set();
    this.notifyScheduled = false;
  }
  notify() {
    this.notifyScheduled = false;
    const subscribers = new Set(this.subscribers);
    for(const callback of subscribers) {
      callback();
    }
  }
  scheduleNotify() {
    if (!this.notifyScheduled) {
      setImmediate(() => this.notify());
      this.notifyScheduled = true;
    }
  }
  select(query) {
    const selector = this.selectf(this.state, query);
    if (isNil(selector)) {
      // TODO select from parent
    }
    else if (isFunction(selector)) {
      return () => selector(this.state, msg);
    }
    else {
      throw new TypeError(`${selector} must be either a function or a null|undefined`);
    }
  }
  dispatch(msg) {
    const dispatcher = this.dispatchf(msg);
    if (isNil(dispatcher)) {
      // TODO pass msg to parent
    }
    else if (isFunction(dispatcher)) {
      const dispatched = dispatcher(this.state, msg, dispatch);
      if (conformsTo(promiseShape, dispatched)) {
        return dispatched.then(() => true);
      }
      else {
        const state = dispatched;
        if (this.state !== state) {
          this.state = state;
          this.scheduleNotify();
        }
        return promise.resolve(true);
      }
    }
    else {
      throw new TypeError(`${dispatcher} must be either a function or a null|undefined.`);
    }
  }
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  store(name) {
    // TODO
  }
}

const store = opts =>
  new Store(opts);

export default store;
