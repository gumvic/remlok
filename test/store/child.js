import { expect } from 'chai';
import sinon from 'sinon';
import parentStore from '../../fixture/store/users';
import childStore from '../../fixture/store/user';

// TODO Also test that child subscribes/unsubscribes to/from parent preperly.

describe('Child store', () => {
  beforeEach(function() {
    const parent = parentStore();
    const child = childStore(parent);
    this.$parent = parent;
    this.$child = child;
  });
  it('selects from parent', function() {
    const child = this.$child;
    const selector = child.select();
    child.dispatch(['select', 'bob']);
    const data = selector();
    expect(data).to.deep.equal({
      id: 'bob',
      name: 'Bob',
      age: 29
    });
  });
  it('dispatches to parent', function() {
    const child = this.$child;
    const selector = child.select();
    child.dispatch(['select', 'bob']);
    child.dispatch(['update', {
      id: 'bob',
      age: 30
    }]);
    const data = selector();
    expect(data).to.deep.equal({
      id: 'bob',
      name: 'Bob',
      age: 30
    });
  });
});
