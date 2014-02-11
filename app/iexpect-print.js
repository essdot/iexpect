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