import { expect } from 'chai';
import store from '../../fixture/store/users';

describe('Store', () => {
  describe('created when', () => {
    before(function() {
      const opts = {
        select: q => st => null,
        dispatch: m => st => st,
        state: {}
      };
      this.$opts = opts;
      this.$badOpts = {
        select: q => st => null
      };
      this.$parent = store(opts);
      this.$badParent = null;
    });
    it('opts passed', function() {
      const opts = this.$opts;
      expect(() => store(opts)).to.not.throw(TypeError);
    });
    it('opts and parent passed', function() {
      const opts = this.$opts;
      const parent = this.$parent;
      expect(() => store(opts, parent)).to.not.throw(TypeError);
    });
  });
  describe('throws when', () => {
    it('no opts passed', function() {
      expect(() => store()).to.throw(TypeError);
    });
    it('bad opts passed', function() {
      const opts = this.$badOpts;
      expect(() => store(opts)).to.throw(TypeError);
    });
    it('bad parent passed', function() {
      const opts = this.$opts;
      const parent = this.$badParent;
      expect(() => store(opts, parent)).to.throw(TypeError);
    });
    it('bad opts and bad parent passed', function() {
      const opts = this.$badOpts;
      const parent = this.$badParent;
      expect(() => store(opts, parent)).to.throw(TypeError);
    });
  });
});
