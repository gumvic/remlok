import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import lowerCase from 'lodash/lowerCase';
import promise from 'bluebird';
import { store } from '../../src/index';

const data = {
  'bob': {
    id: 'bob',
    name: 'Bob',
    age: 29
  },
  'alice': {
    id: 'alice',
    name: 'Alice',
    age: 25
  },
  'roger': {
    id: 'roger',
    name: 'Roger',
    age: 31
  }
};

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
  const id = query;
  return items => items [id];
};

const dispatch = (msg, dispatch, dispatchParent) => {
  const [action, payload] = msg;
  switch(action) {
    case 'add':
    return users => promise.coroutine(function*() {
      const tmpID = 'tmp';
      const user = assign({ id: tmpID }, payload);
      yield dispatch(['addO', user]);
      try {
        const user = yield remote(['add', user]);
        yield dispatch(['del', tmpID]);
        yield dispatch(['addOptimistically', user]);
      }
      catch(_) {
        yield dispatch(['del', tmpID]);
      }
    });
    case 'init':
    return users => payload;
    case 'addOptimistically':
    return users => assign({}, users, { [payload.id]: payload });
    case 'del':
    return users => omit(users, [payload]);
  }
};

const users = () => {
  const state = cloneDeep(data);
  return store({ select, dispatch, state });
};

export default users;
