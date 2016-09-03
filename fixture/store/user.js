import { store } from '../../src/index';

const select = (query, select, selectParent) => {
  return id => selectParent(id)();
};

const dispatch = (msg, select, dispatchParent) => {
  const [action, args] = msg;
  switch(action) {
    case 'select':
    const id = args;
    return _ => id;
    case 'update':
    const user = args;
    return _ => dispatchParent(user);
  }
};

const user = (parent) => {
  return store({ select, dispatch }, parent);
};

export default user;
