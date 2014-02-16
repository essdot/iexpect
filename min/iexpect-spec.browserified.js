(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function iexpectIsModule() {
	"use strict";

	var is = {};

	is.isBoolean = function isBoolean(b) {
		return typeof b === 'boolean';
	};

	is.isDate = function isDate(d) {
		return d instanceof Date;
	};

	is.isError = function isError(e) {
		return e instanceof Error;
	};

	is.isFunction = function isFunction(f) {
		return typeof f === 'function';
	};

	is.isNan = function isNan(n) {
		return n !== n;
	};

	is.isNull = function isNull(n) {
		return n === null;
	};

	is.isPrimitive = function isPrimitive(p) {
		return typeof p === 'string' ||
			typeof p === 'undefined' ||
			typeof p === 'boolean' ||
			typeof p === 'number' ||
			p === null;
	};

	is.isNumber = function isNumber(n) {
		return typeof n === 'number';
	};

	is.isObject = function isObject(o) {
		return o === Object(o);
	};

	is.isRegExp = function isRegExp(r) {
		return r instanceof RegExp;
	};

	is.isString = function isString(s) {
		return typeof s === 'string' || s instanceof String;
	};

	is.isUndefined = function isUndefined(u) {
		return u === void 0;
	};

	module.exports = is;
})();
},{}],2:[function(require,module,exports){
(function iexpectPrintModule() {
	"use strict";

	var is = require('./iexpect-is');

	function printArray(arr) {
		if (arr.length === 0) {
			return '[]';
		}

		var strings = Array.prototype.map.call(arr, function(val) {
			return print(val);
		});

		return '[' + Array.prototype.join.call(strings, ', ') + ']';
	}

	function printPojs(o) {
		var keys = Object.keys(o);

		if (keys.length === 0) {
			return '{}';
		}

		var keyValueStrings = keys.map(function(k) {
			return k + ': ' + print(o[k]);
		});

		return '{ ' + keyValueStrings.join(', ') + ' }';
	}

	function printErrorSpec(spec) {
		var s = '[';

		if (spec.errorObject) {
			return print(spec.errorObject);
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

	function printString(s) {
		return "'" + String.prototype.toString.call(s) + "'";
	}

	function printNumber(n) {
		return Number.prototype.toString.call(n);
	}

	function printFunction(f) {
		var functionName = f.name || 'anonymous';

		return '[Function: ' + functionName + ']';
	}

	function printRegExp(r) {
		return RegExp.prototype.toString.call(r);
	}

	function printDate(d) {
		return '[Date: ' + Date.prototype.toUTCString.call(d) + ']';
	}

	function printError(e) {
		return '[' + e.constructor.name + ': ' + e.message + ']';
	}

	function print(o) {
		if (Array.isArray(o)) {
			return printArray(o);
		}

		if (is.isFunction(o)) {
			return printFunction(o);
		}

		if (is.isNumber(o)) {
			return printNumber(o);
		}

		if (is.isString(o)) {
			return printString(o);
		}

		if (is.isRegExp(o)) {
			return printRegExp(o);
		}

		if (is.isUndefined(o) || is.isNull(o) || is.isBoolean(o)) {
			return '' + o;
		}

		if (is.isDate(o)) {
			return printDate(o);
		}

		if (is.isError(o)) {
			return printError(o);
		}

		if (is.isObject(o)) {
			return printPojs(o);
		}

		return Object.prototype.toString.call(o);
	}

	module.exports = {
		print: print,
		printArray: printArray,
		printErrorSpec: printErrorSpec,
		printObject: printPojs,
		printString: printString
	};
})();
},{"./iexpect-is":1}],3:[function(require,module,exports){
(function iexpectModule() {
	"use strict";

	var is = require('./iexpect-is');
	var print = require('./iexpect-print');

	var iexpect = function (actualValue) {
		var a = new iexpect.Assert();
		a._actual = actualValue;
		a._not = false;

		return a;
	};

	iexpect.expect = iexpect;

	iexpect.Assert = function Assert() {};

	iexpect._toString = print.print;

	function errorSpecFromArgs(args) {
		var errorSpec = {};

		args.forEach(function(a) {
			if (is.isFunction(a)) {
				errorSpec.errorType = a;
			}

			if (is.isString(a)) {
				errorSpec.errorMessage = a;
			}

			if (is.isRegExp(a)) {
				errorSpec.errorPattern = a;
			}

			if (is.isError(a)) {
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

		if (errorSpec.errorType) {
			return thrownError.constructor === errorSpec.errorType;
		}

		if (errorSpec.errorMessage) {
			return thrownError.message.indexOf(errorSpec.errorMessage) !== -1;
		}

		if (errorSpec.errorPattern) {
			return errorSpec.errorPattern.test(thrownError.message);
		}

		return false;
	}

	function objectsDeepEqual(a, b) {
		if (a === b) {
			return true;
		}

		if(is.isNan(a) || is.isNan(b)) {
			return is.isNan(a) && is.isNan(b);
		}
		
		if (is.isPrimitive(a) || is.isPrimitive(b)) {
			return a === b;
		}

		if (is.isDate(a) && is.isDate(b)) {
			return a.getTime() === b.getTime();
		}

		if (is.isRegExp(a) && is.isRegExp(b)) {
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
			var resultObj = {};

			result = o.assertFunction.apply(this, argsToPass);

			if (result === true || result === false) {
				resultObj.value = result;
			} else {
				resultObj = result;
			}

			if (this.resultIsGood(resultObj.value)) {
				return this;
			}

			//if assert function set the error message,
			//no need to construct the error message
			if(resultObj.errorMessage) {
				errorMessage = resultObj.errorMessage;
			} else {
				expectedValue = o.expectedValue || args[0];
				
				templateToUse = this._not ? o.notTemplate : o.template;
				
				if (!templateToUse) {
					templateToUse = 'Assertion failed, expected was: {{expected}}, actual was {{actual}}';
				}

				errorMessage = templateToUse
						.replace("{{expected}}", print.print(expectedValue))
						.replace("{{actual}}", print.print(this._actual));
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
			if (is.isNan(expected) || is.isNan(actual)) {
				return is.isNan(expected) && is.isNan(actual);
			}
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

			if (!is.isString(expected)) {
				return expected === actual;
			}

			expected = expected || '';
			expected = expected.toLowerCase();

			if (expected === 'array') {
				return Array.isArray(actual);
			}

			if (expected === 'function') {
				return is.isFunction(actual);
			}

			if (expected === 'string') {
				return is.isString(actual);
			}

			if (expected === 'nan') {
				return is.isNan(actual);
			}

			if (expected === 'number') {
				return is.isNumber(actual);
			}

			if (expected === 'regex' || expected === 'regexp' || expected === 'reg exp') {
				return is.isRegExp(actual);
			}

			if (expected === 'date') {
				return is.isDate(actual);
			}

			if (expected === 'object') {
				return is.isObject(actual);
			}

			if (expected === 'boolean' || expected === 'bool') {
				return is.isBoolean(actual);
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
			return actual[expected] !== void 0;
		},
		template: 'Expected {{actual}} to have property {{expected}}',
		notTemplate: 'Expected {{actual}} not to have property {{expected}}'
	});

	iexpect.Assert.prototype.toHaveOwnProperty = iexpect.Assert.prototype.makeResolver({
		assertFunction: function(expected, actual) {
			return Object.prototype.hasOwnProperty.call(actual, expected);
		},
		template: 'Expected {{actual}} to have own property {{expected}}',
		notTemplate: 'Expected {{actual}} not to have own property {{expected}}'
	});

	iexpect.Assert.prototype.toHave = iexpect.Assert.prototype.toHaveProperty;
	iexpect.Assert.prototype.toHaveOwn = iexpect.Assert.prototype.toHaveOwnProperty;

	iexpect.Assert.prototype.toThrow = iexpect.Assert.prototype.makeResolver({
		assertFunction: function() {
			var args = [].slice.call(arguments);

			// function is last argument, after any error spec
			var func = args.pop();

			var didThrow = false;
			var thrownError;
			var assertResult = {};

			try {
				func.call(null);
			} catch(e) {
				thrownError = e;
				didThrow = true;
			}

			if(!didThrow) {
				assertResult.errorMessage = 'Expected {{actual}} to throw'.replace('{{actual}}', print.print(func));
				assertResult.value = false;
				return assertResult;
			}

			// No parameters passed to toThrow()
			if (args[0] === undefined) {
				assertResult.errorMessage = 'Expected {{actual}} not to throw but {{thrown}} was thrown'
					.replace('{{actual}}', print.print(func))
					.replace('{{thrown}}', print.print(thrownError));

				assertResult.value = true;
				return assertResult;
			}

			var errorSpec = errorSpecFromArgs(args);
			var errorMatches = errorMatchesSpec(errorSpec, thrownError);

			if (errorMatches) {
				assertResult.errorMessage = 'Expected {{actual}} not to throw an error like {{expected}} but {{thrown}} was thrown'
					.replace('{{actual}}', print.print(func))
					.replace('{{expected}}', print.printErrorSpec(errorSpec))
					.replace('{{thrown}}', print.print(thrownError));
			} else {
				assertResult.errorMessage = 'Expected {{actual}} to throw an error like {{expected}} but {{thrown}} was thrown'
					.replace('{{actual}}', print.print(func))
					.replace('{{expected}}', print.printErrorSpec(errorSpec))
					.replace('{{thrown}}', print.print(thrownError));
			}

			assertResult.value = errorMatches;

			return assertResult;
		}
	});

	Object.defineProperty(iexpect.Assert.prototype, 'and', {
		configurable: true,
		get: function() {
			this._not = false;

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
},{"./iexpect-is":1,"./iexpect-print":2}],4:[function(require,module,exports){
iexpect = require('../app/iexpect');
iexpectPrint = require('../app/iexpect-print');

describe('iexpect', function (){
	describe('toEqual', function() {
		it('evaluates equality (triple-equal)', function() {
			var a = { sport: 'hockey' };
			var b = { sport: 'hockey' };

			// Run iexpect's assertions.
			// If they fail, the test will not proceed.
			iexpect(1).toEqual(1);
			iexpect('a').toEqual('a');
			iexpect(true).toEqual(true);
			iexpect(a).toEqual(a);
			iexpect(b).toEqual(b);
			iexpect(NaN).toEqual(NaN);

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
	});
	
	describe('not', function() {

		it('reverses expectations', function() {
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
	});

	describe('and', function() {

		it('chains expectations', function() {
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

			var shouldThrow = function shouldThrow() {
				var x = void 0;
				x.thing.thing;
			};

			iexpect(shouldThrow).toThrow();
			iexpect(shouldThrow).toThrow().and.toThrow();
			iexpect(shouldThrow).toThrow()
				.and.not.toThrow("fake error message")
				.and.not.toThrow("another fake error message")
				.and.toThrow(TypeError, "Cannot read property 'thing' of undefined");
		});
	});

	describe('to be true/false/undefined', function() {

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

		it('to be false', function() {
			iexpect(5 > 6).toBeFalse();
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
	});

	describe('toBeA/toBeAn', function() {
		it('detects functions', function() {
			iexpect(Object.prototype.toString).toBeA('function');
		});

		it('detects numbers', function() {
			iexpect(77).toBeA('number');
		});

		it('detects objects', function() {
			iexpect({}).toBeAn('object');
			iexpect(Object.prototype).toBeAn('object');
		});

		it('detects strings', function() {
			iexpect('abc').toBeA('string');
			iexpect('').toBeA('string');
			iexpect(new String('')).toBeA('string');
		});

		it('detects arrays', function() {
			iexpect([]).toBeAn('array');
			iexpect(new Array(5)).toBeAn('array');
		});

		it('detects Date objects', function() {
			iexpect(new Date()).toBeA('date');
		});

		it('detects booleans', function() {
			iexpect(true).toBeA('boolean');
		});

		it('detects NaN', function() {
			iexpect(NaN).toBeA('NaN');
		});

		it('detects regexes', function() {
			iexpect(/abcd/).toBeA('regex');
		});

		it('fails correctly', function() {
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
	});

	describe('toDeepEqual', function(){
		it('handles deep equality of arrays', function() {
			var arr1 = [1, 2, 3];
			var arr2 = [1, 2, 3];

			iexpect(arr1).toDeepEqual([1, 2, 3]);
			iexpect(arr1).toDeepEqual(arr1);
			iexpect(arr1).toDeepEqual(arr2);

			iexpect(arr1.concat([9, 16])).toDeepEqual([1, 2, 3, 9, 16]);
			iexpect([]).toDeepEqual([]);

			var badExpect = function badExpect1() {
				iexpect(arr1).toDeepEqual([1, 2, 3, 4]);
			};

			chai.expect(badExpect).to.throw(iexpect.AssertError, 'Expected [1, 2, 3] to deeply equal [1, 2, 3, 4]');
		});

		it('handles deep equality of objects', function() {
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

			iexpect(obj1).toDeepEqual(obj1);
			iexpect(obj1).toDeepEqual(obj2);

			iexpect({}).toDeepEqual({});

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

			chai.expect(badExpect2).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
			chai.expect(badExpect3).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { boolProp: true, boolProp2: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
		});

		it('handles deep equality with NaN', function() {
			iexpect([ 5, NaN, 9 ]).toDeepEqual([ 5, NaN, 9 ]);
			iexpect(NaN).toDeepEqual(NaN);
		});

		it('handles deep equality of primitives', function() {
			iexpect(undefined).toDeepEqual(undefined);
			iexpect('a').toDeepEqual('a');
			iexpect(true).toDeepEqual(true);
			iexpect(null).toDeepEqual(null);
		});

		it('handles deep equality of dates', function() {
			var time = 1388534400000;

			iexpect(new Date(time)).toDeepEqual(new Date(time));

			var badExpect4 = function badExpect4() {
				iexpect(new Date(1)).toDeepEqual(new Date(50000));
			};

			chai.expect(badExpect4).to.throw(iexpect.AssertError, "Expected [Date: Thu, 01 Jan 1970 00:00:00 GMT] to deeply equal [Date: Thu, 01 Jan 1970 00:00:50 GMT]");
		});
	});

	describe('toHaveProperty', function() {
		it('detects properties of objects', function() {
			function Ctor() {}
			Ctor.prototype = { protoProp: 'hello' };
			var o = new Ctor();
			o.prop = 'there';

			iexpect(o).toHaveProperty('protoProp');
			iexpect(o).toHaveProperty('prop');
			iexpect(o).toHaveProperty('toString');

			iexpect([1, 2, 3]).toHaveProperty('slice').and.toHaveProperty('splice');
			iexpect(/regex/).toHaveProperty('test');
			iexpect(7.24).toHave('toFixed');

			var badExpect1 = function badExpect1() {
				iexpect([1, 2, 3]).toHaveProperty('nonesuch');
			};

			var badExpect2 = function badExpect2() {
				iexpect('a').toHaveProperty('toFixed');
			};

			chai.expect(badExpect1).to.throw("Expected [1, 2, 3] to have property 'nonesuch'");
			chai.expect(badExpect2).to.throw("Expected 'a' to have property 'toFixed'");

		});
	});

	describe('toHaveOwnProperty', function() {
		it("detects objects' own properties", function() {
			iexpect({ theProp: 23 }).toHaveOwnProperty('theProp');
			iexpect({ theProp: 23 }).not.toHaveOwnProperty('z');
			iexpect([1]).toHaveOwnProperty('0');
			iexpect(Object).toHaveOwn('prototype');

			var badExpect1 = function badExpect1() {
				iexpect([1, 2, 3]).toHaveOwnProperty('slice');
			};

			var badExpect2 = function badExpect2() {
				iexpect({ theProp: 23 }).toHaveOwnProperty('toString');
			};

			chai.expect(badExpect1).to.throw("Expected [1, 2, 3] to have own property 'slice'");
			chai.expect(badExpect2).to.throw("Expected { theProp: 23 } to have own property 'toString'");
		});
	});

	describe('print', function() {
		it('represents booleans', function() {
			chai.expect(iexpectPrint.print(true)).to.equal('true');
			chai.expect(iexpectPrint.print(false)).to.equal('false');
		});

		it('represents strings', function() {
			chai.expect(iexpectPrint.print('s')).to.equal("'s'");
			chai.expect(iexpectPrint.print('')).to.equal("''");
			chai.expect(iexpectPrint.print('"Hello"')).to.equal("'" + '"Hello"' + "'");
		});

		it('represents numbers', function() {
			chai.expect(iexpectPrint.print(1.234)).to.equal('1.234');
			chai.expect(iexpectPrint.print(Infinity)).to.equal('Infinity');
			chai.expect(iexpectPrint.print(-Infinity)).to.equal('-Infinity');
			chai.expect(iexpectPrint.print(1 / 0)).to.equal('Infinity');
			chai.expect(iexpectPrint.print(0)).to.equal('0');
			chai.expect(iexpectPrint.print(-0)).to.equal('0');
		});

		it('represents NaN', function() {
			chai.expect(iexpectPrint.print(NaN)).to.equal('NaN');
			chai.expect(iexpectPrint.print(Number.NaN)).to.equal('NaN');
			chai.expect(iexpectPrint.print(undefined * 3)).to.equal('NaN');
		});

		it('represents objects', function() {
			chai.expect(iexpectPrint.print(Object.prototype)).to.equal('{}');
			chai.expect(iexpectPrint.print({})).to.equal('{}');
			chai.expect(iexpectPrint.print({a: 575, b: [5, 6, 7, true]})).to.equal('{ a: 575, b: [5, 6, 7, true] }');
		});

		it('represents functions', function() {
			chai.expect(iexpectPrint.print(function(){})).to.equal('[Function: anonymous]');
			chai.expect(iexpectPrint.print(function func(){})).to.equal('[Function: func]');
		});

		it('represents null and undefined', function() {
			chai.expect(iexpectPrint.print(undefined)).to.equal('undefined');
			chai.expect(iexpectPrint.print(null)).to.equal('null');
		});

		it('represents RegExps', function() {
			chai.expect(iexpectPrint.print(/test/)).to.equal('/test/');
		});

		it('represents arrays', function() {
			chai.expect(iexpectPrint.print([])).to.equal('[]');
			chai.expect(iexpectPrint.print([10, 12, 'abc', undefined, {}, []])).to.equal("[10, 12, 'abc', undefined, {}, []]");
		});

		it('represents Dates', function() {
			chai.expect(iexpectPrint.print(new Date(1388534400000))).to.equal('[Date: Wed, 01 Jan 2014 00:00:00 GMT]');
		});

		it('represents Error objects', function() {
			chai.expect(iexpectPrint.print(new TypeError('abc'))).to.equal('[TypeError: abc]');
		});
	});

	describe('throw', function() {
		var shouldThrow = function() {
			var obj = void 0;
			return obj.thing.thing;
		};

		var shouldntThrow = function() {
			return 1;
		};

		var expectTheThrow = function() {
			var thrownError;

			iexpect(shouldThrow).toThrow();
		};

		var expectNoThrow = function() {
			iexpect(shouldntThrow).not.toThrow();
		};

		var badExpect1 = function badExpect1() {
			iexpect(shouldThrow).not.toThrow();
		};

		var badExpect2 = function badExpect2() {
			iexpect(shouldntThrow).toThrow();
		};

		it('not throw', function() {
			expectNoThrow();

			chai.expect(expectNoThrow).to.not.throw();
			chai.expect(badExpect1).to.throw("Expected [Function: anonymous] not to throw but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		});

		it('throw without error spec', function() {
			chai.expect(expectTheThrow).to.not.throw();
			chai.expect(badExpect2).to.throw("Expected [Function: anonymous] to throw");
		});

		it('throw with error spec', function() {
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
				iexpect(shouldThrow).not.toThrow("fake error message").and.not.toThrow("another fake error message");
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
});
},{"../app/iexpect":3,"../app/iexpect-print":2}]},{},[4])