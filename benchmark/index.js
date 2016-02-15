var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

import _ from 'lodash'
import Stateful from '../lib'

suite.add('Stateful#initialize', function() {
  Stateful();
}).on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({
  'async': true
});