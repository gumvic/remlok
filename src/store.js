import isFunction from 'lodash/isFunction';
import conformsTo from 'lodash/conformsTo';
import isPlainObject from 'lodash/isPlainObject';
import pick from 'lodash/pick';
import promise from 'bluebird';
import _setimmediate_ from 'setimmediate';

const promiseShape = {
  then: isFunction
};

const isPromise = x =>
  conformsTo(x, promiseShape);

const isOpts = isPlainObject;

const implShape = {
  select: isFunction,
  dispatch: isFunction
};

const isImpl = x =>
  conformsTo(implShape);

const nsShape = {
  select: isFunction,
  dispatch: isFunction
};

const storeShape = {
  select: isFunction,
  dispatch: isFunction,
  subscribe: isFunction,
  unsubscribe: isFunction
};

const isStore = x =>
  conformsTo(storeShape);

const rootStore = {
  select(query) {
    throw new Error(`No selector found for ${query}`);
  },
  dispatch(msg) {
    throw new Error(`No dispatcher found for ${msg}`);
  },
  subscribe(callback) {
    return () => {};
  },
  unsubscribe(callback) {

  }
};

class Store {
  constructor(opts, parent = rootStore) {
    this.initOpts(opts);
    this.initParent(parent);
    this.initMethods();
    this.initProps();
  }
  initImpl(opts) {
    const impl = pick(opts, ['select', 'dispatch']);
    if (!isImpl(impl)) {
      throw new TypeError(`${impl} TODO`);
    }
    this.impl = impl;
  }
  initState(opts) {
    const { state } = opts;
    this.state = state;
  }
  initOpts(opts) {
    if (!isOpts(opts)) {
      throw new TypeError(`${opts} TODO`);
    }
    this.initImpl(opts);
    this.initState(opts);
  }
  initParent(parent) {
    if (!isStore(parent)) {
      throw new TypeError(`${parent} TODO`);
    }
    this.parent = parent;
  }
  initMethods() {
    this.notify = this.notify.bind(this);
    this.select = this.select.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  initProps() {
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
      setImmediate(this.notify);
      this.notifyScheduled = true;
    }
  }
  select(query) {
    const selector = this.impl.select(
      query,
      this.select,
      this.parent.select);
    if (!isFunction(selector)) {
      throw new TypeError(`${selector} must be a selector.`)
    }
    return () => selector(this.state);
  }
  dispatch(msg) {
    const dispatcher = this.impl.dispatch(
      msg,
      this.dispatch,
      this.parent.dispatch);
    if (!isFunction(dispatcher)) {
      throw new TypeError(`${dispatcher} must be a dispatcher.`)
    }
    const stateOrSaga = dispatcher(this.state);
    if (isPromise(stateOrSaga)) {
      const saga = stateOrSaga;
      return saga.then(true);
    }
    else {
      const state = stateOrSaga;
      this.setState(state);
      return promise.resolve(true);
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
}

/*const ns = (store, ns) => {
  const {
    select = x => x,
    dispatch = x => x
  } = ns;
  if (!conformsTo(ns, nsShape)) {
    throw new TypeError(`${ns} TODO`);
  }
  return {
    select: query => store.select(select(query)),
    dispatch: msg => store.dispatch(dispatch(msg)),
    unsubscribe: store.unsubscribe,
    subscribe: store.subscribe
  };
};*/

const store = (opts, parent) =>
  new Store(opts, parent);

export default store;
