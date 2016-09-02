import update from 'lodash/update';
import { store } from '../../src/index';

const select = (query, select, selectParent) => {
  return favID => selectParent(favID)();
};

const dispatch = (msg, select, dispatchParent) => {
  const favID = msg;
  return oldFavID => favID;
};

const favitem = () => {
  return store({ select, dispatch });
};

export default favitem;
