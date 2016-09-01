import isFunction from 'lodash/isFunction';
import conformsTo from 'lodash/conformsTo';
import promise from 'bluebird';

const optsShape = {
  select: isFunction,
  dispatch: isFunction
};

const promiseShape = {
  then: isFunction
};

const isPromise = x =>
  conformsTo(x, promiseShape);

const rootStore = {
  select(query) {
    throw new Error(`No selector found for ${query}`);
  }
  dispatch(msg) {
    throw new Error(`No dispatcher found for ${msg}`);
  }
  subscribe(callback) {
    return () => {};
  }
};

class Store {
  constructor(opts, parent = rootStore) {
    if (!conformsTo(opts, optsShape)) {
      throw new TypeError(`${opts} TODO`);
    }
    this.notify = this.notify.bind(this);
    this.select = this.select.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.parentSelect = parent.select.bind(parent);
    this.parentDispatch = parent.dispatch.bind(parent);
    this.parentSubscribe = parent.subscribe.bind(parent);
    this.parentUnsubscribe = parent.unsubscribe.bind(parent);
    this.parent = parent;
    this.opts = opts;
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
    const selector = this.opts.select(
      query,
      this.select,
      this.selectParent);
    if (isFunction(selector)) {
      return () => selector(this.state);
    }
    else {
      throw new TypeError(`${selector} must be a selector.`)
    }
  }
  dispatch(msg) {
    const transformerOrSaga = this.opts.dispatch(
      msg,
      this.dispatch,
      this.dispatchParent);
    if (isFunction(transformerOrSaga)) {
      const transformer = transformerOrSaga;
      const state = transformer(this.state);
      this.setState(transformer(this.state));
      return promise.resolve(true);
    }
    else if (isPromise(transformerOrSaga)) {
      const saga = transformerOrSaga;
      return saga.then(true);
    }
    else {
      throw new TypeError(`${transformerOrSaga} must be either a transformer or a saga.`)
    }
  }
  getState() {
    return this.state;
  }
  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.scheduleNotify();
    }
    return this;
  }
  subscribe(callback) {
    if (!this.subscribers.size) {
      this.parentSubscribe(this.notify);
    }
    this.subscribers.add(callback);
    return () => this.unsubscribe(callback);
  }
  unsubscribe(callback) {
    this.subscribers.delete(callback);
    if (!this.subscribers.size) {
      this.parentUnsubscribe(this.notify);
    }
  }
  store(name) {
    const spawner = this.opts.store;
    const store = spawner(name);
    return store;
  }
}

const store = opts =>
  new Store(opts);

export default store;
