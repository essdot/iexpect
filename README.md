# iexpect - A Javascript assertion library

iexpect is a Javascript library that lets you write assertions for unit tests. As the name implies, it implements the 'expect' style of BDD test assertions. This is a personal project, implementing a basic set of assertion functionality. Some examples of the kind of test code iexpect allows you to write: 
```javascript
iexpect(1).toEqual(1);
iexpect(1).not.toEqual(2);
iexpect(myFunction).not.toThrow();
iexpect(myFunction).toBeA('function');
iexpect(void 0).toBeUndefined();
iexpect({ a: 1, b: 2 }).toHaveProperty('a').and.toHaveProperty('b');
iexpect([1, 2].concat([3, 4])).toDeepEqual([1, 2, 3, 4]);
```

## Functionality

* toEqual: Compares values with triple-equals. (There is an exception for `NaN`, since `NaN !== NaN`.)
```javascript
iexpect(1).toEqual(1)
iexpect(NaN).toEqual(NaN)
```
* toDeepEqual: Compares two values for "deep equality". Verifies arrays have same values, objects have same properties, Dates have same time value, RegExps have same pattern.
```javascript
iexpect([1, 2, 3]).toDeepEqual([1, 2, 3])
iexpect({ a: 1, b: 2}).toDeepEqual({ b: 2, a: 1 })
iexpect(NaN).toDeepEqual(NaN)
```
* toBeA/toBeAn: Tests whether a value is a function, object (plain old JS object), array, number, date, RegExp, or NaN.
```javascript
iexpect(myFunction).toBeA('function')
iexpect({}).toBeAn('object')
iexpect(NaN).toBeA('NaN')
iexpect(9).toBeA('number')
iexpect([]).toBeAn('array')
iexpect(new Date()).toBeA('date')
iexpect(/re/).toBeA('regex')
```
* toBeTrue/toBeFalse/toBeUndefined: Test whether value is true/false/undefined
```javascript
iexpect(1 === 2).toBeFalse()
iexpect(1 === 1).toBeTrue()
iexpect(Object.prototype.nonesuch).toBeUndefined()
```
* toThrow: Tests whether a function throws. Optionally set expectations about the type and message of the error thrown.
```javascript
// Expect myFunction to throw any error:  
iexpect(myFunction).toThrow()

// Expect myFunction to throw any TypeError (any error whose constructor is TypeError):  
iexpect(myFunction).toThrow(TypeError)

// Expect myFunction to throw an error whose message contains "Error message":  
iexpect(myFunction).toThrow("Error message")

// Expect myFunction to throw a TypeError whose message contains "Error message':  
iexpect(myFunction).toThrow(TypeError, "Error message")

// Expect myFunction to throw an error whose constructor is the same as errorObject's 
// constructor, and whose message is the same as errorObject's message:  
iexpect(myFunction).toThrow(errorObject)
```
* toHaveOwnProperty/toHaveOwn: Test whether object has property with Object.prototype.hasOwnProperty()
```javascript
iexpect({ a: 1 }).toHaveOwnProperty('a')
iexpect({ a: 1 }).not.toHaveOwnProperty('toString')
iexpect([1, 2]).toHaveOwnProperty('0').and.toHaveOwn('1')
iexpect([1, 2]).not.toHaveOwnProperty('slice')
```
* toHave/toHaveProperty: Test whether object has a property (object[propertyName])
```javascript
iexpect({ a: 1 }).toHaveProperty('toString')
iexpect([ 1 ]).toHave('slice')
```
* not: Reverse expectations 
```javascript
iexpect(myFunction).not.toThrow()
iexpect('a').not.toEqual('b')
```
* and: Chain expectations
```javascript
iexpect([1, 2, 3]).toBeAn('array').and.toDeepEqual([1, 2, 3])
iexpect(myFunction).not.toThrow().and.toBeA('function').and.toEqual(myFunction)
```

## Installing

    sh ./install.sh

(Installs browserify, and mocha for the test runner)

## Tests & Tools

iexpect is tested with [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/). Gulp tasks are provided for preparing scripts. Browserify is used to resolve the node modules into a single script for running the specs in the browser and for generating the standalone iexpect build.

Unit tests can be run on the command line, or in a browser. To run tests on the command line, run `mocha` or `npm test`.

To run the tests in a browser, run `node bin/serve` and browse to [http://localhost:4444](http://localhost:4444).

## Maintainer

* [Justin Sippel](mailto:justin@sippel.com) 

GitHub: [http://github.com/essdot](http://github.com/essdot)


## Thanks

The server script and general browser test setup was taken from the wonderful js-assessment by Rebecca Murphey: https://github.com/rmurphey/js-assessment


## Contributing

As mentioned above, this is a personal project so contributions are not expected, but submit a pull request if you like.


# License

Copyright &copy; 2014 Justin Sippel

This work is licensed under the [Creative Commons Attribution-Share Alike 3.0](http://creativecommons.org/licenses/by-sa/3.0/)
license. You are free to share and remix the work, and to use it for commercial
purposes under the following conditions:

- *Attribution* — You must attribute the work in the manner specified by the
  author or licensor (but not in any way that suggests that they endorse you or
  your use of the work).
- *Share Alike* — If you alter, transform, or build upon this work, you may
  distribute the resulting work only under the same or similar license to this
  one.

Any of these conditions can be waived if you get permission from the copyright
holder.
