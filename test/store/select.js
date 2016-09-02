import { expect } from 'chai';
import sinon from 'sinon';
import usersStore from '../../fixture/store/users';

describe('Store', () => {
  beforeEach(function() {
    this.$store = usersStore();
  });
  describe('selects', () => {
    it('something', function() {
      const store = this.$store;
      const selector = store.select('bob');
      const data = selector();
      expect(data).to.deep.equal({
        id: 'bob',
        name: 'Bob',
        age: 29
      });
    });
  });
});
