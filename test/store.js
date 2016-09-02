import { expect } from 'chai';
import usersStore from '../fixture/usersStore';

describe('Store', () => {
  describe('selects', () => {
    before(function() {
      this.$store = usersStore();
    });
    it('a user', function() {
      const selector = this.$store.select('alice');
      const user = selector();
      expect(user).to.deep.equal({
        id: 'alice',
        name: 'Alice',
        age: 25
      });
    });
  });
});
