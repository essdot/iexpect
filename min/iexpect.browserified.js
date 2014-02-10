(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function iexpectModule() {
	"use strict";

	var is = require('iexpect-is');
	var print = require('iexpect-print');

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
},{"iexpect-is":2,"iexpect-print":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function iexpectPrintModule() {
	"use strict";

	var is = require('iexpect-is');

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
},{"iexpect-is":2}]},{},[1])