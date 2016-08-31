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

const noParent = {
  select(query) {
    // TODO throw
  }
  dispatch(msg) {
    // TODO throw
  }
  subscribe(callback) {
    // TODO nothing
  }
};

class Store {
  constructor(opts, parent = noParent) {
    if (!conformsTo(opts, optsShape)) {
      throw new TypeError(`${opts} TODO`);
    }
    const parent = parent;
    // TODO when to unsubscribe?
    //const parentUnsubscribe = parent.subscribe(() => this.notify());
    this.parent = parent;
    const { select, dispatch, state } = opts;
    this.selector = select;
    this.dispatcher = dispatch;
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
  selectParent(query) {
    return this.parent.select(query);
  }
  selectSelf(query, selector) {
    return () => selector(this.state, query);
  }
  select(query) {
    const select = query => this.select(query);
    const selector = this.selector(this.state, query, select);
    if (isNil(selector)) {
      return this.selectParent(query);
    }
    else if (isFunction(selector)) {
      return this.selectSelf(query, selector);
    }
    else {
      throw new TypeError(`${selector} must be either a function or a null|undefined`);
    }
  }
  dispatchParent(msg) {
    return this.parent.dispatch(msg);
  }
  dispatchSelf(msg, dispatcher) {
    const dispatch = msg => this.dispatch(msg);
    const dispatched = dispatcher(this.state, msg, dispatch);
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
    const dispatcher = this.dispatcher(msg);
    if (isNil(dispatcher)) {
      return this.dispatchParent(msg);
    }
    else if (isFunction(dispatcher)) {
      return this.dispatchSelf(msg, dispatcher);
    }
    else {
      throw new TypeError(`${dispatcher} must be either a function or a null|undefined.`);
    }
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
    // TODO
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
