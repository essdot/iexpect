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