import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
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

const select = (query, select, selectParent) => {
  switch(query) {
    case '$items':
    return users => users;
    default:
    return users => users [query];
  }
};

const dispatch = (msg, dispatch, dispatchParent) => {
  const { id } = msg;
  const props = msg;
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

const users = () => {
  const state = cloneDeep(data);
  return store({ select, dispatch, state });
};

export default users;
