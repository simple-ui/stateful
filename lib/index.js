import {
  isUndefined
} from 'lodash';

/**
 *
 *
 * @module @adaptiveui/stateful
 * @license
 * @adaptiveui/stateful 1.0.0 <https://adaptiveui.io/>
 * Copyright 2016 Adaptive UI <https://adaptiveui.io/>
 * Available under MIT license <https://adaptiveui.io/license>
 */
export default function Stateful(monitor) {

  if (!(this instanceof Stateful)) {
    return new Stateful(monitor);
  }

};

Stateful.create = function createStateful(monitor) {
  return new Stateful(monitor);
};

Stateful.prototype = {

  /**
   * @return {String} source of stateful
   */
    toString() {
    return 'Not Implemented';
  }

};
