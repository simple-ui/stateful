# State

[![Coverage Status](https://coveralls.io/repos/github/adaptiveui/stateful/badge.svg?branch=master)](https://coveralls.io/github/adaptiveui/stateful?branch=master)
[![Build Status](https://travis-ci.org/adaptiveui/stateful.svg?branch=master)](https://travis-ci.org/adaptiveui/stateful)
[![Dependency Status](https://david-dm.org/adaptiveui/stateful.svg)](https://david-dm.org/adaptiveui/stateful.svg?style=flat-square)

#### @adaptiveui/stateful

A (in)finite state machine specialized in simplifying presentation logic.

## Install

Install with npm.

```sh
npm install --save @adaptiveui/stateful
```

Install with bower.

```sh
bower install --save adaptiveui-stateful
```

### Lodash Dependency

This library requires all of lodash. It only imports the methods it needs, supporting use of [rollup.js](http://rollupjs.org/) or [lodash-modularize](https://www.npmjs.com/package/lodash-modularize).

## Quick Usage

```js
import Stateful from "adaptiveui/stateful"

var state1 = {
  onInvoke() {
    // first time it is assigned for an object
  },
  onEnter() {
    // every time it is transitioned to
  },  
  onExit() {
    // every time it is transitioned away
  },
  onDestroy() {
    // when object is destroyed
  },
  onDecorate(currentState, originalStatefulObject) {
    return {
      f1() {

      }
    }
  }
};

var s1 = Stateful(this);

s1.push(state1);
s1.top() === state1;
s1.list() === [state1];
state1 = s1.pop();

```

## Usage

### State API

#### Initialize a state


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
