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
    return payload.id === 13 ?
      promise
        .delay(10)
        .reject() :
      promise
        .delay(10)
        .resolve(
          assign({}, payload, { id: lowerCase(payload.name) }));
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
      const user = assign({ id: tmpID }, payload);
      yield dispatch(['_add', user]);
      try {
        const user = yield remote(['add', user]);
        yield dispatch(['_del', tmpID]);
        yield dispatch(['_add', user]);
      }
      catch(_) {
        yield dispatch(['_del', tmpID]);
      }
    });
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
