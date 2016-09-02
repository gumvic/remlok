import { expect } from 'chai';
import sinon from 'sinon';
import store from '../../fixture/store/remUsers';

describe('Store', () => {
  beforeEach(function() {
    this.$store = store();
  });
  describe('saga', () => {
    it('optimistically updates and then patches with remote data', function(done) {
      const store = this.$store;
      const selector = store.select('tmp');
      
    });
  });
});
