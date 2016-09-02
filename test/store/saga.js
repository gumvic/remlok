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
      const selector = store.select();
      const callback = sinon.spy(() => selector());
      store.subscribe(callback);
      this.$callback = callback;
    });
    it('optimistically updates and then patches with remote data', function() {
      const store = this.$store;
      const callback = this.$callback;
      const user = {
        name: 'Alice',
        age: 25
      };
      return store.dispatch(['add', user])
        .delay(10)
        .then(() => {
          expect(callback.returnValues).to.deep.equal([]);
        });
    });
  });
});
