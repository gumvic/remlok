import { expect } from 'chai';
import sinon from 'sinon';
import store from '../../fixture/store/users';

describe('Store', () => {
  beforeEach(function() {
    this.$store = store();
  });
  it('selects', function() {
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
