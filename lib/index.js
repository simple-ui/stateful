import _ from 'lodash';

/**
 * A (in)finite state machine specialized in simplifying presentation logic.
 *
 * @module @adaptiveui/stateful
 * @license
 * @adaptiveui/stateful 1.0.0 <https://adaptiveui.io/>
 * Copyright 2016 Adaptive UI <https://adaptiveui.io/>
 * Available under MIT license <https://adaptiveui.io/license>
 */
export default function Stateful(host) {

  if (!(this instanceof Stateful)) {
    return new Stateful(host);
  }

  // the state-enabled object
  this.__host__ = host;
  
  // all states applied to host, in order, duplicates allowed
  this.__states__ = [];
  
  // all unique states applied, to help call invoked
  this.__uniqueStates__ = [];

  // store all values decorated for state
  this.__stateHistoricalArtifacts__ = [];
};

Stateful.create = function createStateful(host) {
  return new Stateful(host);
};

Stateful.prototype = {

  transition(states) {
    this.reset();
    this.push(states);
    return this;
  },

  /**
   *
   */
    reset() {
    _.each(this.__states__, state => this.pop());
    return this;
  },

  /**
   *
   */
    push(states) {
    states = (_.isArray(states))
      ? states
      : [states];

    _.each(_.flattenDeep(states), state => this._push(state));
    return this;
  },

  /**
   * apply a new state to the object
   * @param {State} state rules to modify the object
   * @returns {Stateful}
   */
    _push(state) {

    const historicalArtifact = {};
    const hasAlreadyBeenInvokedOnce = (_.includes(this.__uniqueStates__, state));
    const decorateWith = (_.isFunction(state.onDecorate))
      ? state.onDecorate(this.__host__)
      : undefined;

    if (!hasAlreadyBeenInvokedOnce) {
      this.__uniqueStates__.push(state);
    }

    if (!hasAlreadyBeenInvokedOnce && _.isFunction(state.onInvoke)) {
      state.onInvoke.call(this.__host__);
    }

    if (_.isFunction(state.onEnter)) {
      state.onEnter.call(this.__host__);
    }

    this.__stateHistoricalArtifacts__.push(historicalArtifact);
    if (decorateWith) {
      _.each(decorateWith, (p, k) => {
        // TODO add method to auto-call host method and pass value to decorator method
        // TODO add options to fail the operation if the over-writing type does not match
        historicalArtifact[k] = this.__host__[k];
        this.__host__[k] = p;
      });
    }

    this.__states__.push(state);
    return this;
  },

  /**
   * remove top-most state
   * @returns {State}
   */
    pop() {

    const historicalArtifact = this.__stateHistoricalArtifacts__.pop();
    const state = this.__states__.pop();

    _.each(historicalArtifact, (p, k) => {
      this.__host__[k] = p;
    });

    if (_.isFunction(state.onExit)) {
      state.onExit.call(this.__host__);
    }

    return state;
  },

  /**
   * @returns {State} the last applied state
   */
    current() {
    return this.__states__[this.__states__.length - 1];
  },

  /**
   * @returns {Array} of all states applied to the object, in order
   */
    list() {
    return this.__states__;
  },

  /**
   * @return {String} source of stateful
   */
    toString() {
    return _.map(this.list(), _.toString);
  }

};
