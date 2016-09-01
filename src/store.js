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
    this.initOpts(opts);
    this.initParent(parent);
    this.initMisc();
  }
  initParent(parent) {
    const { select, dispatch, subscribe, unsubscribe } = parent;
    this.parent = {
      select: select.bind(parent),
      dispatch: dispatch.bind(parent),
      subscribe,
      unsubscribe
    };
  }
  initOpts(opts) {
    const { select, dispatch, state } = opts;
    this.impl = { select, dispatch };
    this.state = state;
  }
  initMisc() {
    this.notify = this.notify.bind(this);
    this.select = this.select.bind(this);
    this.dispatch = this.dispatch.bind(this);
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
    const selector = this.impl.select(
      query,
      this.select,
      this.parent.select);
    if (isFunction(selector)) {
      return () => selector(this.state);
    }
    else {
      throw new TypeError(`${selector} must be a selector.`)
    }
  }
  dispatch(msg) {
    const transformerOrSaga = this.impl.dispatch(
      msg,
      this.dispatch,
      this.parent.dispatch);
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
      this.parent.subscribe(this.notify);
    }
    this.subscribers.add(callback);
    return () => this.unsubscribe(callback);
  }
  unsubscribe(callback) {
    this.subscribers.delete(callback);
    if (!this.subscribers.size) {
      this.parent.unsubscribe(this.notify);
    }
  }
  store(name) {
    const spawner = this.impl.store;
    const store = spawner(name);
    return store;
  }
}

const store = impl =>
  new Store(impl);

export default store;
