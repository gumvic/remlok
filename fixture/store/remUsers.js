import assign from 'lodash/assign';
import omit from 'lodash/omit';
import lowerCase from 'lodash/lowerCase';
import toArray from 'lodash/toArray';
import promise from 'bluebird';
import { store } from '../../src/index';

const remote = msg => {
  const [action, payload] = msg;
  switch(action) {
    case 'add':
    return payload.age <= 21 ?
      promise
        .reject()
        .delay(10):
      promise
        .resolve(
          assign({}, payload, { id: lowerCase(payload.name) }))
        .delay(10);
  }
};

const select = (query, select, selectParent) => {
  return users => toArray(users);
};

const dispatch = (msg, dispatch, dispatchParent) => {
  const [action, payload] = msg;
  switch(action) {
    case 'add':
    return users => promise.coroutine(function*() {
      const tmpID = 'tmp';
      const tmpUser = assign(payload, { id: tmpID });
      yield dispatch(['_add', tmpUser]);
      try {
        const user = yield remote(['add', tmpUser]);
        const patch = [
          dispatch(['_del', tmpID]),
          dispatch(['_add', user])];
        yield promise.all(patch);
      }
      catch(e) {
        yield dispatch(['_del', tmpID]);
      }
    })();
    case '_add':
    return users => assign({}, users, { [payload.id]: payload });
    case '_del':
    return users => omit(users, [payload]);
  }
};

const users = () => {
  const state = {};
  return store({ select, dispatch, state });
};

export default users;
