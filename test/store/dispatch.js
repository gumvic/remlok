import { expect } from 'chai';
import sinon from 'sinon';
import store from '../../fixture/store/users';

describe('Store', () => {
  beforeEach(function() {
    this.$store = store();
  });
  describe('dispatch', () => {
    it('updates state immediately', function() {
      const store = this.$store;
      const selector = store.select('bob');
      store.dispatch({
        id: 'bob',
        age: 30
      });
      const data = selector();
      expect(data).to.deep.equal({
        id: 'bob',
        name: 'Bob',
        age: 30
      });
    });
  });
});
