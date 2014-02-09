(function iexpectModule() {
	"use strict";

	var iexpect = {};

	iexpect.expect = function (actualValue) {
		var a = new iexpect.Assert();
		a._actual = actualValue;
		a._not = false;

		return a;
	};

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
				throw new iexpect.AssertError({ errorMessage: this.errorMessage });
			}

			var msg;
			var expectedValue = o.expectedValue || args[0];
			
			var templateToUse = this._not ? o.notTemplate : o.template;
			
			if (!templateToUse) {
				templateToUse = 'Assertion failed, expected was: {{expected}}, actual was {{actual}}';
			}

			msg = templateToUse
					.replace("{{expected}}", _toString(expectedValue))
					.replace("{{actual}}", _toString(this._actual));

			throw new iexpect.AssertError({ errorMessage: msg });
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