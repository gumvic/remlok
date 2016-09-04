import assign from 'lodash/assign';
import omit from 'lodash/omit';
import lowerCase from 'lodash/lowerCase';
import toArray from 'lodash/toArray';
import promise from 'bluebird';
import { store } from '../../src/index';

const remote = msg => {
  const [action, args] = msg;
  switch(action) {
    case 'add':
    const user = args;
    return user.age <= 21 ?
      promise
        .reject()
        .delay(10):
      promise
        .resolve(
          assign({}, user, { id: lowerCase(user.name) }))
        .delay(10);
  }
};

const select = (query, select, selectParent) => {
  switch(query) {
    case 'users': return users => toArray(users);
  }
};

const dispatch = (msg, dispatch, dispatchParent) => {
  const [action, args] = msg;
  let user = null;
  switch(action) {
    case 'add':
    user = args;
    return promise.coroutine(function*(users) {
      const tmpID = 'tmp';
      const tmpUser = assign(user, { id: tmpID });
      yield dispatch(['_add', tmpUser]);
      try {
        const user = yield remote(['add', tmpUser]);
        const patch = promise.all([
          dispatch(['_del', tmpID]),
          dispatch(['_add', user])]);
        yield patch;
      }
      catch(e) {
        yield dispatch(['_del', tmpID]);
      }
    });
    case '_add':
    user = args;
    return users => assign({}, users, { [user.id]: user });
    case '_del':
    const id = args;
    return users => omit(users, [id]);
  }
};

const users = () => {
  const state = {};
  return store({ select, dispatch, state });
};

export default users;
