import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import update from 'lodash/update';
import { store } from '../src/index';

const users = {
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

const select = (query, select, selectParent) => {
  const id = query;
  return users => users [id];
};

const dispatch = (msg, select, dispatchParent) => {
  const { id } = msg;
  const props = omit(msg, ['id']);
  return users => {
    if (users [id]) {
      const user = assign({}, users [id], props);
      return assign({}, users, { [id]: user });
    }
    else {
      return users;
    }
  };
};

const usersStore = () => {
  const state = cloneDeep(users);
  return store({ select, dispatch, state });
};

export default usersStore;
