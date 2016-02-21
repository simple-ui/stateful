import test from 'tape'
import _ from 'lodash'
import Stateful from '../lib'

test('State Creation', (test) => {

  var o = {};
  var cloned = _.clone(o);
  var stateful = Stateful(o);

  test.equal(typeof stateful.push, 'function', 'stateful can push');
  test.equal(typeof stateful.pop, 'function', 'stateful can pop');
  test.deepEqual(cloned, o, 'object is not allowed from being stateful');
  test.end();

});
