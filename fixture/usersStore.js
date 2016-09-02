import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import update from 'lodash/update';
import { store } from '~/index';

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
  return st => update(users, [id], user => assign({}, user, props));
};

const usersStore = () => {
  const state = cloneDeep(users);
  return store({ select, dispatch, state });
};

export default usersStore;
