import _ from 'lodash';

/*
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
  this.__state__ = [];

  // all unique states applied, to help call invoked
  this.__uniqueStates__ = [];

  // store all values decorated for state
  this.__stateArtifacts__ = [];

  // add history of states
  this.__stateHistory__ = [];
};

Stateful.create = function createStateful(host) {
  return new Stateful(host);
};

Stateful.prototype = {

  /*
   *
   */
  transition(states) {
    this.popStates();
    this.pushStates(states);
    this.__stateHistory__.push(states);
    return this;
  },

  /*
   *
   */
  rewind() {

    var states = this.__stateHistory__.pop();

    if (_.isEqual(states, this.__state__)) {
      states = this.__stateHistory__.pop();
    }

    if (_.isUndefined(states)) {
      return this;
    }

    this.popStates();
    this.pushStates(states);
    return this;
  },

  /*
   * @returns {State} the current state(s)
   */
  current() {
    return this.__state__;
  },

  /*
   * @return {String} source of stateful
   */
  toString() {
    return _.map(this.__state__, _.toString);
  },

  /*
   *
   */
  pushStates(states) {
    states = (_.isArray(states))
      ? states
      : [states];

    _.each(_.flattenDeep(states), state => this.pushState(state));
    return this;
  },

  /*
   *
   */
  popStates() {
    _.each(this.__state__, state => this.popState());
    return this;
  },

  /*
   * apply a new state to the object
   * @param {State} state rules to modify the object
   * @returns {Stateful}
   */
  pushState(state) {

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

    this.__stateArtifacts__.push(historicalArtifact);
    if (decorateWith) {
      _.each(decorateWith, (p, k) => {
        // TODO add options to fail the operation if the over-writing type does not match
        historicalArtifact[k] = this.__host__[k];
        this.__host__[k] = p;
      });
    }

    this.__state__.push(state);
    return this;
  },

  /*
   * remove top-most state
   * @returns {State}
   */
  popState() {

    const historicalArtifact = this.__stateArtifacts__.pop();
    const state = this.__state__.pop();

    _.each(historicalArtifact, (p, k) => {
      if (_.isUndefined(p)) {
        delete this.__host__[k];
      }
      else {
        this.__host__[k] = p;
      }
    });

    if (_.isFunction(state.onExit)) {
      state.onExit.call(this.__host__);
    }

    return state;
  }

};
