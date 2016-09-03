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
    return dispatchParent(user);
    default:
    return st => st;
  }
};

const user = () => {
  return store({ select, dispatch });
};

export default user;
