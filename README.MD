# Stateful

[![Coverage Status](https://coveralls.io/repos/github/adaptiveui/stateful/badge.svg?branch=master)](https://coveralls.io/github/adaptiveui/stateful?branch=master)
[![Build Status](https://travis-ci.org/adaptiveui/stateful.svg?branch=master)](https://travis-ci.org/adaptiveui/stateful)
[![Dependency Status](https://david-dm.org/adaptiveui/stateful.svg)](https://david-dm.org/adaptiveui/stateful.svg?style=flat-square)

#### @adaptiveui/stateful

A (in)finite state machine specialized in simplifying presentation logic.

The `Stateful` decorator can add state to any object. Typically an object would add a state variable or inherit state. With `Stateful` you add state capabilities to an object and manage that through a simple interface.

## Install

Install with npm.

```sh
npm install --save adaptiveui-stateful
```

Install with bower.

```sh
bower install --save adaptiveui-stateful
```

### Lodash Dependency

This library requires a small set of lodash. Use [lodash-modularize](https://www.npmjs.com/package/lodash-modularize) to limit how much of lodash is included in your project.

## Quick Usage

```js
import Stateful from "adaptiveui/stateful"

var object = {
  value: 'no state',
  action: function() {
    return this.value
  }
};

var stateful = Stateful(object);
var state = {
  onInvoke() {
    // first time it is assigned for an object
  },
  onEnter() {
    // every time it is transitioned to
  },  
  onExit() {
    // every time it is transitioned away
  },
  onDecorate(hostObject) {
    const { action } = hostObject;
    return {
      value: 'state',
      action() {
        return action() + ' applied';
      }
    }
  }
};

object.action() === 'no state';
stateful.pushState(state);
object.action() === 'state applied';

stateful.current() === [state];
state === stateful.popState();
```

## Usage

### Stateful API

When creating a `Stateful` for a host object you manage the current set of states applied through the `Stateful` object itself.

```js
var object = {
  action(a, b) {
    return a + b;
  }
};
var stateful = Stateful(object);
```

Once a `Stateful` object is created it can be used to transition to different states. Typically a state machine will benefit from allowing multiple states to be applied together. In this way, state definitions do not suffer from permutation explosion. For instance, instead of `OpenWarningState` and `OpenSuccessState` you can have `OpenState`, `CloseState`, `WarningState`, and `SuccessState`.

```js
stateful.transition([stateA, stateB]);
stateful.transition(stateA);
```

A `Stateful` object can have states applied over time, if different aspects of an application control the state of an object.

```js
stateful.transition([stateA, stateB]);
// ...is the same as...
stateful.popStates();
stateful.pushState(stateA);
stateful.pushState(stateB);
// ...is the same as...
stateful.popStates();
stateful.pushStates([stateA, stateB]);
```

A `Stateful` object remembers the transitions over time and can `rewind` state values, this is useful for _blips_ where you apply a state and then return to your previous state. As an example, if you were building a game you may want to go into attach mode, but go back to whatever you were doing after danger the danger is gone. A `Stateful` object tracks your last state.

```js
AttackState = {
  onEnter() {
    mediator.on('isEnemyFarAway', function() {
      // attack state does not know the last state, but it wants to end attacking
      stateful.rewind();
    });
  }
};
DetectEnemyState = {
  onEnter() {
    mediator.on('isEnemyNearby', function() {
      stateful.transition(AttackState);
    });
  }
};
stateful.transition([FarmState, DetectEnemyState]);
```

### State API

A state is a normal object with the following methods.

#### onInvoke

A method called the first time a state is applied to an object.

#### onEnter

A method called every time a state is applied to an object.

#### onExit

A method called every time a state is unapplied to an object.

#### onDecorate

A method which returns an object to override values and functions on the host object.

#### Example

A state with all properties and a sample object.

```js
var object = {
  a: 1,
  b: 2,
  action1(a, b) {
    return a + b;
  },
  action2(a, b) {
    return this.a + this.b;
  }
};
```

A state might change or override this object could look like this. The `onEnter` and `onExit` methods should be functional reflections.

```js
var state = {
  onEnter() {
    this.a === 1;
    this.a = 2;
  },
  onExit() {
    this.a === 2;
    this.a = 1;
  }
}
```

A state may need to run setup functions once, with `onInvoke`.

```js
var state = function() {
  this.used = 0;
  this.onInvoke = function() {
    this.used += 1;
  }
}
```

A state can alter the host object with `onDecorate`.

```js
var state = {
  onDecorate(hostObject) {
    const { a } = hostObject;
    return {
      a(a, b) {
        // call the host method (this may have been altered by another state)
        return a(a, b) + a(a, b);
      },
      b() {
        // change the functionality completely
        return (this.a * 2) + (this.b * 2);
      }
    }
  }
}
```

## License

MIT © [mwjaworski](http://adaptiveui.io)

This software is released under the MIT license:

Copyright (c) 2016 mwjaworski mjaworski@acm.org

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.))
