import isFunction from 'lodash/isFunction';
import conformsTo from 'lodash/conformsTo';
import isNil from 'lodash/isNil';

class Up {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}

const up = v => new Up(v);

const optsShape = {
  select: isFunction,
  dispatch: isFunction
};

const promiseShape = {
  then: isFunction
};

const rootStore = {
  select(query) {
    throw new Error(`No selector for ${query}`);
  }
  dispatch(msg) {
    throw new Error(`No dispatcher for ${dispatch}`);
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
    const parent = parent;
    this.unsubscribeParent = parent.subscribe(() => this.notify());
    this.parent = parent;
    this.opts = opts;
    this.state = state;
    this.subscribers = new Set();
    this.notifyScheduled = false;
    this.select = this.select.bind(this);
    this.dispatch = this.dispatch.bind(this);
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
  /*selectParent(query) {
    return this.parent.select(query);
  }
  selectSelf(query, selector) {
    return () => selector(this.state, query);
  }
  select(query) {
    if (isUndefined(query)) {
      throw new TypeError(`${query} must not be undefined.`);
    }
    const selectorOrQuery = this.opts.selector(
      this.state,
      query,
      this.select);
    if (isUndefined(selectorOrQuery)) {
      throw new TypeError(`No selector found for ${query}.`);
    }
    if (isFunction(selectorOrQuery)) {
      return this.selectSelf(query, selectorOrQuery);
    }
    else {
      return this.selectParent(query);
    }
  }
  dispatchParent(msg) {
    return this.parent.dispatch(msg);
  }
  dispatchSelf(msg, dispatcher) {
    const dispatched = dispatcher(
      this.state,
      msg,
      this.dispatch);
    if (conformsTo(promiseShape, dispatched)) {
      return dispatched.then(() => true);
    }
    else {
      const state = dispatched;
      this.setState(dispatched);
      return promise.resolve(true);
    }
  }
  dispatch(msg) {
    if (isUndefined(query)) {
      throw new TypeError(`${msg} must not be undefined.`);
    }
    const dispatcherOrMsg = this.opts.dispatcher(msg);
    if (isUndefined(dispatcherOrMsg)) {
      throw new TypeError(`No dispatcher found for ${msg}.`);
    }
    if (isFunction(dispatcherOrMsg)) {
      return this.dispatchSelf(msg, dispatcher);
    }
    else {
      return this.dispatchParent(msg);
    }
  }*/
  selectParent(query) {
    return this.parent.select(query);
  }
  selectSelf(query, selector) {
    return () => selector(this.state, query);
  }
  select(query) {
    const selectorOrQuery = this.opts.select(
      this.state,
      query,
      this.select);
    if (isFunction(selectorOrQuery)) {
      return this.selectSelf(query, selectorOrQuery);
    }
    else if (selectorOrQuery instanceof Up) {
      return this.selectParent(selectorOrQuery.getValue());
    }
    else {
      // TODO error
    }
  }
  dispatch(msg) {
    const dispatchingOrMsg = this.opts.dispatch(
      msg,
      this.dispatch);
    if (isUndefined(dispatchingOrMsg)) {
      return promise.resolve(true);
    }
    else if (isPromise(dispatchingOrMsg)) {
      return dispatchingOrMsg.then(() => this.transform(msg));
    }
    else if (dispatchingOrMsg instanceof Up) {
      return this.dispatchParent(dispatchingOrMsg.getValue());
    }
  }
  transform(msg) {
    const transformer = this.opts.transform;
    this.setState(state => transformer(state, msg));
  }
  getState() {
    return this.state;
  }
  setState(state) {
    if (isFunction(state)) {
      state = state(this.state);
    }
    if (this.state !== state) {
      this.state = state;
      this.scheduleNotify();
    }
    return this;
  }
  /*state(state) {
    if (isUndefined(state)) {
      return this._state;
    }
    else {
      let newState = this._state;
      if (isFunction(state)) {
        newState = state(newState);
      }
      else {
        newState = state;
      }
      if (this._state !== newState) {
        this._state = newState;
        this.scheduleNotify();
      }
    }
  }*/
  /*subscribeParent(callback) {
    return this.parent.subscribe(callback);
  }
  subscribeSelf(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  subscribe(callback) {
    const unsubscribeParent = this.subscribeParent(callback);
    const unsubscribeSelf = this.subscribeSelf(callback);
    return () => {
      unsubscribeParent();
      unsubscribeSelf();
    };
  }*/
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  destroy() {

  }
  store(name) {
    const spawner = this.opts.store;
    const store = spawner(name);
    return store;
  }
}

/*class NS {
  constructor(parent) {

  }
  select(query) {}
  subscribe(callback) {
    return this.parent.subscribe(callback);
  }
}*/

const store = opts =>
  new Store(opts);

export default store;
