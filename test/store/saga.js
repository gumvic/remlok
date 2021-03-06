import { expect } from 'chai';
import sinon from 'sinon';
import store from '../../fixture/store/remUsers';

describe('Store', () => {
  beforeEach(function() {
    this.$store = store();
  });
  describe('saga', () => {
    beforeEach(function() {
      const store = this.$store;
      const callback = sinon.spy();
      store.subscribe('users', callback);
      this.$callback = callback;
    });
    it('optimistically updates and patches with remote data', function() {
      const store = this.$store;
      const callback = this.$callback;
      const user = {
        name: 'Alice',
        age: 25
      };
      return store.dispatch(['add', user])
        .delay(10)
        .then(() => {
          expect(callback.args).to.deep.equal([
            [
              [
                {
                  id: 'tmp',
                  name: 'Alice',
                  age: 25
                }
              ]
            ],
            [
              [
                {
                  id: 'alice',
                  name: 'Alice',
                  age: 25
                }
              ]
            ]
          ]);
        });
    });
    it('optimistically updates and reverts because of remote rejection', function() {
      const store = this.$store;
      const callback = this.$callback;
      const user = {
        name: 'Jill Pole',
        age: 14
      };
      return store.dispatch(['add', user])
        .delay(10)
        .then(() => {
          expect(callback.args).to.deep.equal([
            [
              [
                {
                  id: 'tmp',
                  name: 'Jill Pole',
                  age: 14
                }
              ]
            ],
            [
              []
            ]
          ]);
        });
    });
  });
});
