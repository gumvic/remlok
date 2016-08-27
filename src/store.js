import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

class Store {
  constructor(state) {
    this.curState = state;
    this.subscribers = new Set();
    this.notifyScheduled = false;
  }
  state(newState) {
    const oldState = this.curState;
    if (isUndefined(newState)) {
      return this.curState;
    }
    else if (isFunction(newState)) {
      this.curState = newState(this.curState);
    }
    else {
      this.curState = newState;
    }
    if (oldState !== this.curState) {
      this.scheduleNotify();
    }
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

const store = state =>
  new Store(state);

export default store;
