import { expect } from 'chai';
import sinon from 'sinon';
import store from '../../fixture/store/users';

describe('Store', () => {
  beforeEach(function() {
    this.$store = store();
  });
  describe('subscription', () => {
    beforeEach(function() {
      const store = this.$store;
      const callback = sinon.spy();
      const unsubscribe = store.subscribe(callback);
      this.$callback = callback;
      this.$unsubscribe = unsubscribe;
    });
    it('called when state changed', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      store.dispatch({
        id: 'alice',
        age: 26
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.true;
        done();
      }, 10);
    });
    it('called once when state changed multiple times', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      store.dispatch({
        id: 'alice',
        age: 26
      });
      store.dispatch({
        id: 'alice',
        age: 27
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.true;
        done();
      }, 10);
    });
    it('called once when subscribed multiple times when state changed', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      store.subscribe(callback);
      store.dispatch({
        id: 'alice',
        age: 26
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.true;
        done();
      }, 10);
    });
    it('not called when state not changed', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      store.dispatch({
        id: 'no-one',
        age: 25
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.false;
        done();
      }, 10);
    });
    it('not called when unsubscribed', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      const unsubscribe = this.$unsubscribe;
      unsubscribe();
      store.dispatch({
        id: 'alice',
        age: 26
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.false;
        done();
      }, 10);
    });
    it('not called when subscribed multiple times and unsubscribed', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      const unsubscribe = this.$unsubscribe;
      store.subscribe(callback);
      unsubscribe();
      store.dispatch({
        id: 'alice',
        age: 26
      });
      setTimeout(() => {
        expect(callback.calledOnce).to.be.false;
        done();
      }, 10);
    });
    it('not called when unsubscribed right after dispatch', function(done) {
      const store = this.$store;
      const callback = this.$callback;
      const unsubscribe = this.$unsubscribe;
      store.dispatch({
        id: 'alice',
        age: 26
      });
      unsubscribe();
      setTimeout(() => {
        expect(callback.calledOnce).to.be.false;
        done();
      }, 10);
    });
  });
});
