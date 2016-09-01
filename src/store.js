import isFunction from 'lodash/isFunction';
import conformsTo from 'lodash/conformsTo';
import isNil from 'lodash/isNil';

const optsShape = {
  select: isFunction,
  dispatch: isFunction
};

const promiseShape = {
  then: isFunction
};

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
    const parent = parent;
    this.unsubscribeParent = parent.subscribe(() => this.notify());
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
    const select = query => this.select(query);
    const selectParent = query => this.parent.select(query);
    const selector = this.opts.select(
      query,
      select,
      selectParent);
    if (isFunction(selector)) {
      return () => selector(this.state);
    }
    else {
      throw new TypeError(`${selector} must be a selector.`)
    }
  }
  dispatch(msg) {
    const dispatch = msg => this.dispatch(msg);
    const dispatchParent = msg => this.parent.dispatch(msg);
    const transformerOrSaga = this.opts.dispatch(
      msg,
      dispatch,
      dispatchParent);
    if (isFunction(transformerOrSaga)) {
      const transformer = transformerOrSaga;
      const state = transformer(this.state);
      this.setState(state);
      return promise.resolve(true);
    }
    else if (isPromise(transformerOrSaga)) {
      const saga = transformerOrSaga;
      return saga.then(true);
    }
    else {
      throw new TypeError(`${transformerOrSaga} must be either a transformer a saga.`)
    }
  }
  /*select(query) {
    const select = query => this.select(query);
    const selectParent = query => this.parent.select(query);
    const dataOrSelector = this.opts.select(
      this.state,
      query,
      select,
      selectParent);
    if (isFunction(dataOrSelector)) {
      const selector = dataOrSelector;
      return () => selector(this.state);
    }
    else {
      const selector = st => this.opts.select(st, query);
      return () => selector(this.state);
    }
  }
  dispatch(msg) {
    const stateOrSaga = this.opts.dispatch(
      this.state,
      msg,
      dispatch,
      dispatchParent);
    if (isPromise(stateOrSaga)) {
      const saga = stateOrSaga;
      return saga.then(true);
    }
    else {
      const state = stateOrSaga;
      this.setState(state);
    }
  }*/
  /*dispatch(msg) {
    const transformerOrSaga = this.opts.dispatch(
      msg,
      dispatch,
      dispatchParent);
    if (isFunction(transformerOrSaga)) {
      const transformer = transformerOrSaga;
      this.setState(transformer(this.state));
      return promise.resolve(true);
    }
    else if (isPromise(transformerOrSaga)) {
      const saga = transformerOrSaga;
      return saga.then(true);
    }
    else {
      throw new TypeError(`No saga or transformer found for ${msg}`);
    }
  }*/
  /*dispatch(msg) {
    const dispatch = msg => this.dispatch(msg);
    const dispatchParent = msg => this.parent.dispatch(msg);
    const dispatching = this.opts.dispatch(
      msg,
      dispatch,
      dispatchParent);
    if (isUndefined(dispatching)) {
      return promise.resolve(true);
    }
    else if (isPromise(dispatching)) {

    }
    else {
      throw new TypeError(`No dispatcher found for ${msg}`);
    }
  }*/
  /*transform(msg) {
    const state = this.opts.transform(this.state, msg);
    this.setState(state);
  }*/
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
