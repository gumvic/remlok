import update from 'lodash/update';
import { store } from '../../src/index';

const select = (query, select, selectParent) => {
  const by = query;
  const items = selectParent('items');
  return _ => sortBy(items(), by);
};

const dispatch = (msg, select, dispatchParent) => {

};

const sorted = () => {
  return store({ select, dispatch });
};

export default sorted;
