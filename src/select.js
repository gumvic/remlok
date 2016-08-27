import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import promise from 'bluebird';
import selection from './selection';
import mutation from './mutation';
import connection from './connection';

const localSelector = selector => {
  if (!selector) {
    return st => null;
  }
  else if (isFunction(selector)) {
    return selector;
  }
  else {
    throw new TypeError(`${selector} must be either a falsey or a function.`);
  }
}

const selectRemote = _ => null;

const select = (name, args) => {
  const selected = selection(name) [args];
  if (isPlainObject(selected)) {
    /*return new promise((resolve, reject) => {
      const local = localSelector(selected.$);
      const remote = unset(selected, '$');
      forEach(remote, (request, name) => {
        const connect = connection(name);
        const {
          query,
          onOK = (data, newData) => st,
          onError = (data, error) => st } = request;
        if (!isFunction(onOK)) {
          throw new TypeError(`${onOK} must be a function.`);
        }
        if (!isFunction(onError)) {
          throw new TypeError(`${onError} must be a function.`);
        }
        connect(query)
          .then(newData => {
            db.data(data => onOK(data, newData));
            return local(da.data());
          })
          .catch(error => {
            db.data(data => onError(data, error));
            return null;
          });
      });
    });*/
    connect(query)
      .then(newData => {
        db.data(data => onOK(data, newData));
        return local(da.data());
      })
      .catch(error => {
        db.data(data => onError(data, error));
        return null;
      });
  }
  else {
    const local = localSelector(selected);
    return promise.resolve(selector(db.data()));
  }
};

export default select;
