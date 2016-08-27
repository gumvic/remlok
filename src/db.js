import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

class DB {
  constructor(data) {
    this.curData = data;
    this.subscribers = new Set();
    this.notifyScheduled = false;
  }
  data(newData) {
    const oldData = this.curData;
    if (isUndefined(newData)) {
      return this.curData;
    }
    else if (isFunction(newData)) {
      this.curData = newData(this.curData);
    }
    else {
      this.curData = newData;
    }
    if (oldData !== this.curData) {
      this.scheduleNotify();
    }
    return newData;
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
      subscriber(this.curData);
    }
  }
}

const db = data =>
  new DB(data);

export default db;
