(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
iexpect = require('iexpect');

describe('iexpect', function (){
	it('to equal', function() {
		var a = { sport: 'hockey' };
		var b = { sport: 'hockey' };

		// Run iexpect's assertions.
		// If they fail, the test will not proceed.
		iexpect(1).toEqual(1);
		iexpect('a').toEqual('a');
		iexpect(true).toEqual(true);
		iexpect(a).toEqual(a);
		iexpect(b).toEqual(b);

		// Create some functions with bad (incorrect) expectations.
		// When expectations are wrong, they will throw.
		// So if these functions don't throw, iexpect is doing something wrong.
		var badExpect1 = function badExpect1() {
			iexpect(1).toEqual(2);
		};

		var badExpect2 = function badExpect2() {
			iexpect('a').toEqual(true);
		};

		var badExpect3 = function badExpect3() {
			iexpect(a).toEqual(b);
		};

		// Confirm that the bad expectations throw
		// the errors we think they will throw.
		chai.expect(badExpect1).to.throw('Expected 1 to equal 2');
		chai.expect(badExpect2).to.throw("Expected 'a' to equal true");
		chai.expect(badExpect3).to.throw("Expected { sport: 'hockey' } to equal { sport: 'hockey' }");
	});

	it('not', function() {
		iexpect(false).not.toBeTrue();
		iexpect(true).not.toBeFalse();
		iexpect('a').not.toBeUndefined();
		iexpect(1).not.toBeA('function');
		iexpect(true).not.toBeAn('object');
		iexpect('1234').not.toBeA('regex');

		var badExpect1 = function badExpect1() {
			iexpect('a').not.toEqual('a');
		};

		var badExpect2 = function badExpect2() {
			iexpect({a: 1}).not.toDeepEqual({a: 1});
		};

		var badExpect3 = function badExpect3() {
			iexpect(undefined).not.toBeUndefined();
		};

		var badExpect4 = function badExpect4() {
			iexpect(true).not.toBeA('boolean');
		};

		var expectation = iexpect('a');

		chai.expect(expectation._not).to.equal(false);
		chai.expect(expectation).to.have.property('not');

		// 'not' is a getter. Referring to it invokes its get function.
		// So we are testing the identity of the result of invoking the getter, 
		// not the identity of the getter itself!
		chai.expect(expectation.not).to.equal(expectation);
		chai.expect(expectation._not).to.equal(true);

		chai.expect(badExpect1).to.throw("Expected 'a' not to equal 'a'");
		chai.expect(badExpect2).to.throw('Expected { a: 1 } not to deeply equal { a: 1 }');
		chai.expect(badExpect3).to.throw('Expected undefined not to be undefined');
		chai.expect(badExpect4).to.throw("Expected true not to be a boolean");
	});

	it('and', function() {
		var expectation = iexpect('a');

		expectation.not.toEqual('b');

		chai.expect(expectation._not).to.equal(true);

		expectation.and.toBeA('string');

		chai.expect(expectation._not).to.equal(false);

		iexpect([2, 3]).toHaveProperty('0').and.toHaveProperty('1');
		iexpect({ a: 1 }).not.toHaveProperty('b').and.toHaveProperty('a');
		iexpect({ a: 1 }).toHaveProperty('a').and.not.toHaveProperty('b');
		iexpect(1).not.toEqual(2).and.toEqual(1);
		iexpect(true).toBeTrue().and.not.toBeFalse();
		iexpect([2, 3]).toHaveProperty('0').and.toDeepEqual([2, 3]);
	});

	it('to be true', function() {
		iexpect(true).toBeTrue();
		iexpect(1 == 1).toBeTrue();
		iexpect(1 < 2).toBeTrue();

		var badExpect1 = function badExpect1() {
			iexpect(false).toBeTrue();
		};

		var badExpect2 = function badExpect2() {
			iexpect(undefined).toBeTrue();
		};

		var badExpect3 = function badExpect3() {
			iexpect(123).toBeTrue();
		};

		chai.expect(badExpect1).to.throw('Expected false to be true');
		chai.expect(badExpect2).to.throw('Expected undefined to be true');
		chai.expect(badExpect3).to.throw('Expected 123 to be true');
	});

	it('to be undefined', function() {
		iexpect(undefined).toBeUndefined();
		iexpect(void 0).toBeUndefined();

		var badExpect1 = function badExpect1() {
			iexpect('a').toBeUndefined();
		};

		var badExpect2 = function badExpect2() {
			iexpect(2).toBeUndefined();
		};

		var badExpect3 = function badExpect3() {
			iexpect({}).toBeUndefined();
		};

		chai.expect(badExpect1).to.throw("Expected 'a' to be undefined");
		chai.expect(badExpect2).to.throw("Expected 2 to be undefined");
		chai.expect(badExpect3).to.throw("Expected {} to be undefined");
	});

	it('to be a', function() {
		iexpect(Object.prototype.toString).toBeA('function');
		iexpect({}).toBeAn('object');
		iexpect(iexpect).toBeAn('object');
		iexpect('abc').toBeA('string');
		iexpect([]).toBeAn('array');
		iexpect(77).toBeA('number');
		iexpect(new Date()).toBeA('date');
		iexpect(true).toBeA('boolean');
		iexpect(/abcd/).toBeA('regex');

		var badExpect1 = function() {
			iexpect(77).toBeA('function');
		};

		var badExpect2 = function() {
			iexpect(null).toBeAn('object');
		};

		var badExpect3 = function() {
			iexpect('array').toBeAn('array');
		};

		chai.expect(badExpect1).to.throw("Expected 77 to be a function");
		chai.expect(badExpect2).to.throw("Expected null to be an object");
		chai.expect(badExpect3).to.throw("Expected 'array' to be an array");
	});

	it('to deep equal', function() {
		var arr1 = [1, 2, 3];
		var arr2 = [1, 2, 3];

		var obj1 = {
			boolProp: true,
			stringProp: 'abc',
			arrProp: [1, 2, 3],
			undefProp: undefined,
			nullProp: null
		};

		var obj2 = {
			undefProp: undefined,
			stringProp: 'abc',
			arrProp: [1, 2, 3],
			boolProp: true,
			nullProp: null
		};

		var time = 1388534400000;

		iexpect(arr1).toDeepEqual([1, 2, 3]);
		iexpect(arr1).toDeepEqual(arr1);
		iexpect(arr1).toDeepEqual(arr2);
		iexpect(obj1).toDeepEqual(obj1);
		iexpect(obj1).toDeepEqual(obj2);

		iexpect(arr1.concat([9, 16])).toDeepEqual([1, 2, 3, 9, 16]);
		
		iexpect({}).toDeepEqual({});
		iexpect([]).toDeepEqual([]);

		iexpect(undefined).toDeepEqual(undefined);
		iexpect('a').toDeepEqual('a');
		iexpect(true).toDeepEqual(true);
		iexpect(null).toDeepEqual(null);
		iexpect(new Date(time)).toDeepEqual(new Date(time));

		var badExpect1 = function badExpect1() {
			iexpect(arr1).toDeepEqual([1, 2, 3, 4]);
		};

		var badExpect2 = function badExpect2() {
			var objWithLess = {
				stringProp: 'abc',
				arrProp: [1, 2, 3],
				undefProp: undefined,
				nullProp: null
			};

			iexpect(obj1).toDeepEqual(objWithLess);
		};

		var badExpect3 = function badExpect3() {
			var objWithMore = {
				boolProp: true,
				boolProp2: true,
				stringProp: 'abc',
				arrProp: [1, 2, 3],
				undefProp: undefined,
				nullProp: null
			};

			iexpect(obj1).toDeepEqual(objWithMore);
		};

		var badExpect4 = function badExpect4() {
			iexpect(new Date(1)).toDeepEqual(new Date(50000));
		};

		chai.expect(badExpect1).to.throw(iexpect.AssertError, 'Expected [1, 2, 3] to deeply equal [1, 2, 3, 4]');
		chai.expect(badExpect2).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
		chai.expect(badExpect3).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { boolProp: true, boolProp2: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
		chai.expect(badExpect4).to.throw(iexpect.AssertError, "Expected [Date: Thu, 01 Jan 1970 00:00:00 GMT] to deeply equal [Date: Thu, 01 Jan 1970 00:00:50 GMT]");

	});

	it('to have property', function() {
		iexpect({ theProp: 23 }).toHaveProperty('theProp');
		iexpect({ theProp: 23 }).not.toHaveProperty('z');
		iexpect([1]).toHaveProperty('0');
		iexpect(Object).toHaveProperty('prototype');
	});

	it('to string', function() {
		chai.expect(iexpect._toString(true)).to.equal('true');
		chai.expect(iexpect._toString(false)).to.equal('false');
		chai.expect(iexpect._toString(undefined)).to.equal('undefined');
		chai.expect(iexpect._toString(null)).to.equal('null');
		chai.expect(iexpect._toString('s')).to.equal("'s'");
		chai.expect(iexpect._toString(1.234)).to.equal('1.234');
		chai.expect(iexpect._toString(/test/)).to.equal('/test/');
		
		chai.expect(iexpect._toString(function(){})).to.equal('[Function: anonymous]');
		chai.expect(iexpect._toString(function func(){})).to.equal('[Function: func]');
		
		chai.expect(iexpect._toString({})).to.equal('{}');
		chai.expect(iexpect._toString([])).to.equal('[]');

		chai.expect(iexpect._toString([10, 12, 'abc', undefined, {}, []])).to.equal("[10, 12, 'abc', undefined, {}, []]");
		chai.expect(iexpect._toString({a: 575, b: [5, 6, 7, true]})).to.equal('{ a: 575, b: [5, 6, 7, true] }');
		
		chai.expect(iexpect._toString(new Date(1388534400000))).to.equal('[Date: Wed, 01 Jan 2014 00:00:00 GMT]');

		chai.expect(iexpect._toString(new TypeError('abc'))).to.equal('[TypeError: abc]');
	});

	it('not throw', function() {
		var shouldThrow = function() {
			var obj = void 0;
			return obj.thing.thing;
		};

		var shouldntThrow = function() {
			return 1;
		};

		var expectNoThrow = function() {
			iexpect(shouldntThrow).not.toThrow();
		};

		var badExpect = function() {
			iexpect(shouldThrow).not.toThrow();
		};

		expectNoThrow();

		chai.expect(expectNoThrow).to.not.throw();
		chai.expect(badExpect).to.throw("Expected [Function: anonymous] not to throw but [TypeError: Cannot read property 'thing' of undefined] was thrown");
	});

	it('throw without error spec', function() {
		var shouldThrow = function() {
			var obj = void 0;
			return obj.thing.thing;
		};

		var shouldntThrow = function() {
			return 1;
		};

		var badExpect = function() {
			iexpect(shouldntThrow).toThrow();
		};

		var expectTheThrow = function() {
			var thrownError;

			iexpect(shouldThrow).toThrow();
		};

		chai.expect(expectTheThrow).to.not.throw();
		chai.expect(badExpect).to.throw("Expected [Function: anonymous] to throw");
	});

	it('throw with error spec', function() {
		var shouldThrow = function() {
			var obj = void 0;
			return obj.thing.thing;
		};

		var expectTheThrow = function() {
			var thrownError;

			iexpect(shouldThrow).toThrow(TypeError);
			iexpect(shouldThrow).toThrow("Cannot read property 'thing' of undefined");
			iexpect(shouldThrow).toThrow(TypeError, "Cannot read property 'thing' of undefined");
			iexpect(shouldThrow).toThrow("Cannot read property 'thing' of undefined", TypeError);
			
			try {
				shouldThrow();
			} catch(e) {
				thrownError = e;
			}

			iexpect(shouldThrow).toThrow(thrownError);
			iexpect(shouldThrow).not.toThrow("fake error message");
		};

		var badExpect1 = function() {
			function FakeError(){}

			iexpect(shouldThrow).toThrow(FakeError);
		};

		var badExpect2 = function() {
			iexpect(shouldThrow).toThrow('a fake error message');
		};

		var badExpect3 = function() {
			var newError = new RangeError();
			newError.message = 'fake error message';

			iexpect(shouldThrow).toThrow(newError);
		};

		chai.expect(shouldThrow).to.throw();
		expectTheThrow();

		chai.expect(expectTheThrow).to.not.throw();

		chai.expect(badExpect1).to.throw("Expected [Function: anonymous] to throw an error like [FakeError] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		chai.expect(badExpect2).to.throw("Expected [Function: anonymous] to throw an error like [a fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		chai.expect(badExpect3).to.throw("Expected [Function: anonymous] to throw an error like [RangeError: fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");

	});
});
},{"iexpect":2}],2:[function(require,module,exports){
(function iexpectModule() {
	"use strict";

	var iexpect;

	iexpect = function (actualValue) {
		var a = new iexpect.Assert();
		a._actual = actualValue;
		a._not = false;

		return a;
	};

	iexpect.expect = iexpect;

	iexpect.Assert = function Assert() {};

	function _toStringArray(arr) {
		if (arr.length === 0) {
			return '[]';
		}

		var strings = Array.prototype.map.call(arr, function(val) {
			return _toString(val);
		});

		return '[' + Array.prototype.join.call(strings, ', ') + ']';
	}

	function _toStringPojs(o) {
		var keys = Object.keys(o);

		if (keys.length === 0) {
			return '{}';
		}

		var keyValueStrings = keys.map(function(k) {
			return k + ': ' + _toString(o[k]);
		});

		return '{ ' + keyValueStrings.join(', ') + ' }';
	}

	function _toStringErrorSpec(spec) {
		var s = '[';

		if (spec.errorObject) {
			return _toString(spec.errorObject);
		}

		if (spec.errorType) {
			s += spec.errorType.name;
		}

		if (spec.errorMessage) {
			var messagePrefix = spec.errorType ? ': ' : '';
			s += messagePrefix + spec.errorMessage;
		}

		if (spec.errorPattern) {
			var patternPrefix = spec.errorType ? ': ' : '';
			s += patternPrefix + spec.errorPattern.toString();
		}

		return s + ']';
	}

	function _toString(o) {
		if (Array.isArray(o)) {
			return _toStringArray(o);
		}

		if (typeof o === 'function') {
			var functionName = o.name || 'anonymous';

			return '[Function: ' + functionName + ']';
		}

		if (typeof o === 'number') {
			return Number.prototype.toString.call(o);
		}

		if (typeof o === 'string' || o instanceof String) {
			return "'" + String.prototype.toString.call(o) + "'";
		}

		if (o instanceof RegExp) {
			return RegExp.prototype.toString.call(o);
		}

		if (o === void 0 || o === null || o === true || o === false) {
			return '' + o;
		}

		if (o instanceof Date) {
			return '[Date: ' + Date.prototype.toUTCString.call(o) + ']';
		}

		if (o instanceof Error) {
			return '[' + o.constructor.name + ': ' + o.message + ']';
		}

		return _toStringPojs(o);
	}

	iexpect._toString = _toString;

	function errorSpecFromArgs(args) {
		var errorSpec = {};

		args.forEach(function(a) {
			if (typeof a === 'function') {
				errorSpec.errorType = a;
			}

			if (typeof a === 'string') {
				errorSpec.errorMessage = a;
			}

			if (a instanceof RegExp) {
				errorSpec.errorPattern = a;
			}

			if (a instanceof Error) {
				errorSpec.errorObject = a;
			}
		});

		return errorSpec;
	}
	function errorMatchesSpec(errorSpec, thrownError) {
		if (errorSpec.errorObject) {

			if (errorSpec.errorObject === thrownError) {
				return true;
			}

			return errorSpec.errorObject.constructor === thrownError.constructor &&
					errorSpec.errorObject.message === thrownError.message;
		}

		if (errorSpec.errorType && thrownError.constructor !== errorSpec.errorType) {
			return false;
		}

		if (errorSpec.errorMessage && thrownError.message.indexOf(errorSpec.errorMessage) === -1) {
			return false;
		}

		if (errorSpec.errorPattern && !errorSpec.errorPattern.test(thrownError.message)) {
			return false;
		}

		return true;
	}

	function objectIsPrimitive(o) {
		return typeof o === 'string' ||
			typeof o === 'undefined' ||
			typeof o === 'boolean' ||
			typeof o === 'number' ||
			o === null;
	}

	function objectsDeepEqual(a, b) {
		if (a === b) {
			return true;
		}
		
		if (objectIsPrimitive(a) || objectIsPrimitive(b)) {
			return a === b;
		}

		if (a instanceof Date && b instanceof Date) {
			return a.getTime() === b.getTime();
		}

		if (a instanceof RegExp && b instanceof RegExp) {
			return RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
		}

		var aKeys = Object.keys(a);
		var bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) { return false; }

		for (var i = 0; i < aKeys.length; i++) {
			var key = aKeys[i];

			if (!objectsDeepEqual(a[key], b[key])) {
				return false;
			}
		}

		return true;
	}

	iexpect.Assert.prototype.makeResolver = function(o) {
		return function resolve() {
			var errorMessage;
			var expectedValue;
			var templateToUse;

			var args = [].slice.call(arguments);
			var argsToPass = args.slice();
			argsToPass.push(this._actual);

			var result;

			result = o.assertFunction.apply(this, argsToPass);

			if (this.resultIsGood(result)) {
				return this;
			}

			//if assert function set the error message,
			//no need to construct the error message
			if(this.errorMessage) {
				errorMessage = this.errorMessage;
			} else {
				expectedValue = o.expectedValue || args[0];
				
				templateToUse = this._not ? o.notTemplate : o.template;
				
				if (!templateToUse) {
					templateToUse = 'Assertion failed, expected was: {{expected}}, actual was {{actual}}';
				}

				errorMessage = templateToUse
						.replace("{{expected}}", _toString(expectedValue))
						.replace("{{actual}}", _toString(this._actual));
			}

			if (o.processErrorMessage) {
				errorMessage = o.processErrorMessage.call(this, errorMessage, expectedValue, this._actual);
			}

			throw new iexpect.AssertError({ errorMessage: errorMessage });
		};
	};

	iexpect.Assert.prototype.resultIsGood = function(result) {
		if (this._not) {
			return result === false;
		}

		return result === true;
	};

	iexpect.Assert.prototype.toEqual = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(expected, actual) {
			return expected === actual;
		},
		template: 'Expected {{actual}} to equal {{expected}}',
		notTemplate: 'Expected {{actual}} not to equal {{expected}}'
	});

	iexpect.Assert.prototype.toBeFalse = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(actual) {
			return actual === false;
		},
		expectedValue: false,
		template: 'Expected {{actual}} to be false',
		notTemplate: 'Expected {{actual}} not to be false'
	});

	iexpect.Assert.prototype.toBeTrue = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(actual) {
			return actual === true;
		},
		expectedValue: true,
		template: 'Expected {{actual}} to be true',
		notTemplate: 'Expected {{actual}} not to be true'
	});

	iexpect.Assert.prototype.toBeUndefined = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(actual) {
			return actual === void 0;
		},
		template: 'Expected {{actual}} to be undefined',
		notTemplate: 'Expected {{actual}} not to be undefined'
	});

	iexpect.Assert.prototype.toBeA = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(expected, actual) {
			if (expected === undefined || expected === null) {
				return false;
			}

			if (typeof expected !== 'string' && !(expected instanceof String)) {
				return expected === actual;
			}

			expected = expected || '';
			expected = expected.toLowerCase();

			if (expected === 'array') {
				return Array.isArray(actual);
			}

			if (expected === 'function') {
				return typeof actual === 'function';
			}

			if (expected === 'string') {
				return typeof actual === 'string' || actual instanceof String;
			}

			if (expected === 'number') {
				return typeof actual === 'number';
			}

			if (expected === 'function') {
				return typeof actual === 'function';
			}

			if (expected === 'regex' || expected === 'regexp' || expected === 'reg exp') {
				return actual instanceof RegExp;
			}

			if (expected === 'date') {
				return actual instanceof Date;
			}

			if (expected === 'object') {
				return actual === Object(actual);
			}

			if (expected === 'boolean' || expected === 'bool') {
				return typeof actual === 'boolean';
			}

			return false;
		},
		processErrorMessage: function(errMsg, expected, actual) {
			return errMsg.replace("to be a '" + expected + "'", "to be a " + expected)
					.replace('to be a a', 'to be an a')
					.replace('to be a o', 'to be an o');
		},
		template: 'Expected {{actual}} to be a {{expected}}',
		notTemplate: 'Expected {{actual}} not to be a {{expected}}'
	});

	iexpect.Assert.prototype.toBeAn = iexpect.Assert.prototype.toBeA;

	iexpect.Assert.prototype.toDeepEqual = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(expected, actual) {
			return objectsDeepEqual(expected, actual);
		},
		template: 'Expected {{actual}} to deeply equal {{expected}}',
		notTemplate: 'Expected {{actual}} not to deeply equal {{expected}}'
	});

	iexpect.Assert.prototype.toHaveProperty = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(expected, actual) {
			return Object.prototype.hasOwnProperty.call(actual, expected);
		},
		template: 'Expected {{actual}} to have property {{expected}}',
		notTemplate: 'Expected {{actual}} not to have property {{expected}}'
	});

	iexpect.Assert.prototype.toHave = iexpect.Assert.prototype.toHaveProperty;

	iexpect.Assert.prototype.toThrow = iexpect.Assert.prototype.makeResolver({
		assertFunction: function() {
			var args = [].slice.call(arguments);

			// function is last argument, after any error spec
			var func = args.pop();

			var didThrow = false;
			var thrownError;

			try {
				func.call(null);
			} catch(e) {
				thrownError = e;
				didThrow = true;
			}

			if(!didThrow) {
				this.errorMessage = 'Expected {{actual}} to throw'.replace('{{actual}}', _toString(func));
				return false;
			}

			// No parameters passed to toThrow()
			if (args[0] === undefined) {
				this.errorMessage = 'Expected {{actual}} not to throw but {{thrown}} was thrown'
					.replace('{{actual}}', _toString(func))
					.replace('{{thrown}}', _toString(thrownError));

				return true;
			}

			var errorSpec = errorSpecFromArgs(args);
			var errorMatches = errorMatchesSpec(errorSpec, thrownError);

			if (errorMatches) {
				this.errorMessage = 'Expected {{actual}} not to throw an error like {{expected}} but {{thrown}} was thrown'
					.replace('{{actual}}', _toString(func))
					.replace('{{expected}}', _toStringErrorSpec(errorSpec))
					.replace('{{thrown}}', _toString(thrownError));
			} else {
				this.errorMessage = 'Expected {{actual}} to throw an error like {{expected}} but {{thrown}} was thrown'
					.replace('{{actual}}', _toString(func))
					.replace('{{expected}}', _toStringErrorSpec(errorSpec))
					.replace('{{thrown}}', _toString(thrownError));
			}

			return errorMatches;
		}
	});

	Object.defineProperty(iexpect.Assert.prototype, 'and', {
		configurable: true,
		get: function() {
			this._not = false;
			this.errorMessage = undefined;

			return this;
		}
	});

	Object.defineProperty(iexpect.Assert.prototype, 'not', {
		configurable: true,
		get: function() {
			this._not = true;

			return this;
		}
	});

	iexpect.AssertError = function AssertError(o) {
		o = o || {};
		this.message = o.errorMessage;
	};

	iexpect.AssertError.prototype = Object.create(Error.prototype);

	module.exports = iexpect;
})();
},{}]},{},[1])