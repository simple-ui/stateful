import test from 'tape'
import _ from 'lodash'
import Stateful from '../lib'

test('State Creation', (test) => {

  var o = {};
  var cloned = _.clone(o);
  var stateful = Stateful(o);
  var stateful2 = Stateful.create(o);

  test.equal(typeof stateful.push, 'function', 'stateful can push');
  test.equal(typeof stateful.pop, 'function', 'stateful can pop');
  test.deepEqual(cloned, o, 'object is not allowed from being stateful');

  test.deepEqual(stateful.__original__, stateful2.__original__, 'create and a method invocation both create Stateful objects');
  test.end();

});

test('State Events', (test) => {

  var o = {};
  var events = {
    onInvoke: false,
    onEnter: false,
    onExit: false,
    onDecorate: false
  };
  var stateEvents = {
    onInvoke: function() {
      events.onInvoke = true;
    },
    onEnter: function() {
      events.onEnter = true;
    },
    onExit: function() {
      events.onExit = true;
    },
    onDecorate: function() {
      events.onDecorate = true;
      return {};
    }
  };

  var stateful = Stateful(o);

  stateful.push(stateEvents);
  test.equal(events.onInvoke, true, 'onInvoke is called');
  test.equal(events.onEnter, true, 'onEnter is called');
  test.equal(events.onDecorate, true, 'onDecorator is called');
  test.equal(events.onExit, false, 'onExit is not called, yet');

  stateful.pop();
  test.equal(events.onExit, true, 'onExit is called');
  test.end();

});

test('State Pushing', (test) => {

  var o = {
    a: 0,
    b: 0,
    c: 0
  };
  var state = {
    onInvoke: function() {
      this.a += 1;
      this.b += 1;
    },
    onEnter: function() {
      this.a += 1;
      this.c += 1;
    }
  };

  var stateful = Stateful(o);

  stateful.push(state);
  stateful.push(state);
  stateful.push(state);
  stateful.push(state);

  test.equal(o.a, 5, 'onEnter x4, onInvoke x1');
  test.equal(o.b, 1, 'onInvoke x1');
  test.equal(o.c, 4, 'onEnter x4');
  test.end();

});

test('State Decoration', (test) => {

  var o = {
    value: 0,
    a: function() {
      return this.value + 1;
    },
    b: function() {
      return this.value + 2;
    }
  };
  var state = {
    onDecorate: function(original) {
      const { a, b, value } = original;
      return {
        value: value + 1,
        a: function() {
          return a.call(this) + 1;
        },
        b: function() {
          return b.call(this) + 1;
        }
      };
    }
  };

  var stateful = (Stateful(o));

  stateful.push(state);
  test.equal(o.a(), 3, 'a() decorated');
  test.equal(o.b(), 4, 'b() decorated');
  test.equal(o.value, 1, 'value decorated');

  stateful.push(state);
  test.equal(o.a(), 5, 'a() decorated');
  test.equal(o.b(), 6, 'b() decorated');
  test.equal(o.value, 2, 'value decorated');

  test.end();

});
