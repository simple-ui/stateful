import _ from 'lodash';

/**
 *
 *
 * @module @adaptiveui/stateful
 * @license
 * @adaptiveui/stateful 1.0.0 <https://adaptiveui.io/>
 * Copyright 2016 Adaptive UI <https://adaptiveui.io/>
 * Available under MIT license <https://adaptiveui.io/license>
 */
export default function Stateful(original) {

  if (!(this instanceof Stateful)) {
    return new Stateful(original);
  }

  this.__original__ = original;
  this.__states__ = [];
  this.__usedStates__ = [];
};

Stateful.create = function createStateful(original) {
  return new Stateful(original);
};

Stateful.prototype = {

  /**
   *
   */
    push(state) {

    var hasAlreadyBeenInvokedOnce = (_.contains(this.__usedStates__, state));
    var decorateWith = (_.isFunction(state.onDecorate))
      ? state.onDecorate(this.__current__, this.__original__)
      : undefined;

    if (!hasAlreadyBeenInvokedOnce) {
      this.__usedStates__.push(state);
    }

    if (!hasAlreadyBeenInvokedOnce && _.isFunction(state.onInvoke)) {
      state.onInvoke.call(this.__original__);
    }

    if (_.isFunction(state.onEnter)) {
      state.onEnter.call(this.__original__);
    }

    if (decorateWith) {
      _.each(decorateWith, function(p, k) {
        this[k] = p;
      }, this.__original__);
    }

    this.__states__.push(state);
    return this;
  },

  pop() {
    var state = this.__states__.pop();

    if (_.isFunction(state.onExit)) {
      state.onExit.call(this.__original__);
    }

    return state;
  },

  current() {
    return this.__states__[this.__states__.length - 1];
  },

  list() {
    return this.__states__;
  },

  /**
   * @return {String} source of stateful
   */
    toString() {
    return this.list();
  }

};
