iexpect = require('iexpect');

describe('iexpect', function (){
	it('to equal', function() {
		var a = { sport: 'hockey' };
		var b = { sport: 'hockey' };

		iexpect.expect(1).toEqual(1);
		iexpect.expect('a').toEqual('a');
		iexpect.expect(true).toEqual(true);
		iexpect.expect(a).toEqual(a);
		iexpect.expect(b).toEqual(b);

		var badExpect1 = function badExpect1() {
			iexpect.expect(1).toEqual(2);
		};

		var badExpect2 = function badExpect2() {
			iexpect.expect('a').toEqual(true);
		};

		var badExpect3 = function badExpect3() {
			iexpect.expect(a).toEqual(b);
		};

		expect(badExpect1).to.throw('Expected 1 to equal 2');
		expect(badExpect2).to.throw("Expected 'a' to equal true");
		expect(badExpect3).to.throw("Expected { sport: 'hockey' } to equal { sport: 'hockey' }");
	});

	it('not', function() {
		iexpect.expect(false).not.toBeTrue();
		iexpect.expect(true).not.toBeFalse();
		iexpect.expect('a').not.toBeUndefined();
		iexpect.expect(1).not.toBeA('function');
		iexpect.expect(true).not.toBeAn('object');
		iexpect.expect('1234').not.toBeA('regex');

		var badExpect1 = function badExpect1() {
			iexpect.expect('a').not.toEqual('a');
		};

		var badExpect2 = function badExpect2() {
			iexpect.expect({a: 1}).not.toDeepEqual({a: 1});
		};

		var badExpect3 = function badExpect3() {
			iexpect.expect(undefined).not.toBeUndefined();
		};

		var badExpect4 = function badExpect4() {
			iexpect.expect(true).not.toBeA('boolean');
		};

		var expectation = iexpect.expect('a');

		expect(expectation._not).to.equal(false);
		expect(expectation).to.have.property('not');

		// 'not' is a getter. Referring to it invokes its get function.
		// So we are testing the identity of the result of invoking the getter, 
		// not the identity of the getter itself!
		expect(expectation.not).to.equal(expectation);
		expect(expectation._not).to.equal(true);

		expect(badExpect1).to.throw("Expected 'a' not to equal 'a'");
		expect(badExpect2).to.throw('Expected { a: 1 } not to deeply equal { a: 1 }');
		expect(badExpect3).to.throw('Expected undefined not to be undefined');
		expect(badExpect4).to.throw("Expected true not to be a 'boolean'");
	});

	it('and', function() {
		var expectation = iexpect.expect('a');

		expectation.not.toEqual('b');

		expect(expectation._not).to.equal(true);

		expectation.and.toBeA('string');

		expect(expectation._not).to.equal(false);

		iexpect.expect([2, 3]).toHaveProperty('0').and.toHaveProperty('1');
		iexpect.expect({ a: 1 }).not.toHaveProperty('b').and.toHaveProperty('a');
		iexpect.expect({ a: 1 }).toHaveProperty('a').and.not.toHaveProperty('b');
		iexpect.expect(1).not.toEqual(2).and.toEqual(1);
		iexpect.expect(true).toBeTrue().and.not.toBeFalse();
		iexpect.expect([2, 3]).toHaveProperty('0').and.toDeepEqual([2, 3]);
	});

	it('to be true', function() {
		iexpect.expect(true).toBeTrue();
		iexpect.expect(1 == 1).toBeTrue();
		iexpect.expect(1 < 2).toBeTrue();

		var badExpect1 = function badExpect1() {
			iexpect.expect(false).toBeTrue();
		};

		var badExpect2 = function badExpect2() {
			iexpect.expect(undefined).toBeTrue();
		};

		var badExpect3 = function badExpect3() {
			iexpect.expect(123).toBeTrue();
		};

		expect(badExpect1).to.throw('Expected false to be true');
		expect(badExpect2).to.throw('Expected undefined to be true');
		expect(badExpect3).to.throw('Expected 123 to be true');
	});

	it('to be undefined', function() {
		iexpect.expect(undefined).toBeUndefined();
		iexpect.expect(void 0).toBeUndefined();

		var badExpect1 = function badExpect1() {
			iexpect.expect('a').toBeUndefined();
		};

		var badExpect2 = function badExpect2() {
			iexpect.expect(2).toBeUndefined();
		};

		var badExpect3 = function badExpect3() {
			iexpect.expect({}).toBeUndefined();
		};

		expect(badExpect1).to.throw("Expected 'a' to be undefined");
		expect(badExpect2).to.throw("Expected 2 to be undefined");
		expect(badExpect3).to.throw("Expected {} to be undefined");
	});

	it('to be a', function() {
		iexpect.expect(Object.prototype.toString).toBeA('function');
		iexpect.expect({}).toBeAn('object');
		iexpect.expect(iexpect).toBeAn('object');
		iexpect.expect('abc').toBeA('string');
		iexpect.expect([]).toBeAn('array');
		iexpect.expect(77).toBeA('number');
		iexpect.expect(new Date()).toBeA('date');
		iexpect.expect(true).toBeA('boolean');
		iexpect.expect(/abcd/).toBeA('regex');

		var badExpect1 = function() {
			iexpect.expect(77).toBeA('function');
		};

		var badExpect2 = function() {
			iexpect.expect(null).toBeAn('object');
		};

		var badExpect3 = function() {
			iexpect.expect('abc').toBeAn('array');
		};

		expect(badExpect1).to.throw("Expected 77 to be a 'function'");
		expect(badExpect2).to.throw("Expected null to be a 'object'");
		expect(badExpect3).to.throw("Expected 'abc' to be a 'array'");
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

		iexpect.expect(arr1).toDeepEqual([1, 2, 3]);
		iexpect.expect(arr1).toDeepEqual(arr1);
		iexpect.expect(arr1).toDeepEqual(arr2);
		iexpect.expect(obj1).toDeepEqual(obj1);
		iexpect.expect(obj1).toDeepEqual(obj2);

		iexpect.expect(arr1.concat([9, 16])).toDeepEqual([1, 2, 3, 9, 16]);
		
		iexpect.expect({}).toDeepEqual({});
		iexpect.expect([]).toDeepEqual([]);

		iexpect.expect(undefined).toDeepEqual(undefined);
		iexpect.expect('a').toDeepEqual('a');
		iexpect.expect(true).toDeepEqual(true);
		iexpect.expect(null).toDeepEqual(null);
		iexpect.expect(new Date(time)).toDeepEqual(new Date(time));

		var badExpect1 = function badExpect1() {
			iexpect.expect(arr1).toDeepEqual([1, 2, 3, 4]);
		};

		var badExpect2 = function badExpect2() {
			var objWithLess = {
				stringProp: 'abc',
				arrProp: [1, 2, 3],
				undefProp: undefined,
				nullProp: null
			};

			iexpect.expect(obj1).toDeepEqual(objWithLess);
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

			iexpect.expect(obj1).toDeepEqual(objWithMore);
		};

		var badExpect4 = function badExpect4() {
			iexpect.expect(new Date(1)).toDeepEqual(new Date(50000));
		};

		expect(badExpect1).to.throw(iexpect.AssertError, 'Expected [1, 2, 3] to deeply equal [1, 2, 3, 4]');
		expect(badExpect2).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
		expect(badExpect3).to.throw(iexpect.AssertError, "Expected { boolProp: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null } to deeply equal { boolProp: true, boolProp2: true, stringProp: 'abc', arrProp: [1, 2, 3], undefProp: undefined, nullProp: null }");
		expect(badExpect4).to.throw(iexpect.AssertError, "Expected [Date: Thu, 01 Jan 1970 00:00:00 GMT] to deeply equal [Date: Thu, 01 Jan 1970 00:00:50 GMT]");

	});

	it('to have property', function() {
		iexpect.expect({ theProp: 23 }).toHaveProperty('theProp');
		iexpect.expect({ theProp: 23 }).not.toHaveProperty('z');
		iexpect.expect([1]).toHaveProperty('0');
		iexpect.expect(Object).toHaveProperty('prototype');
	});

	it('to string', function() {
		expect(iexpect._toString(true)).to.equal('true');
		expect(iexpect._toString(false)).to.equal('false');
		expect(iexpect._toString(undefined)).to.equal('undefined');
		expect(iexpect._toString(null)).to.equal('null');
		expect(iexpect._toString('s')).to.equal("'s'");
		expect(iexpect._toString(1.234)).to.equal('1.234');
		expect(iexpect._toString(/test/)).to.equal('/test/');
		
		expect(iexpect._toString(function(){})).to.equal('[Function: anonymous]');
		expect(iexpect._toString(function func(){})).to.equal('[Function: func]');
		
		expect(iexpect._toString({})).to.equal('{}');
		expect(iexpect._toString([])).to.equal('[]');

		expect(iexpect._toString([10, 12, 'abc', undefined, {}, []])).to.equal("[10, 12, 'abc', undefined, {}, []]");
		expect(iexpect._toString({a: 575, b: [5, 6, 7, true]})).to.equal('{ a: 575, b: [5, 6, 7, true] }');
		
		expect(iexpect._toString(new Date(1388534400000))).to.equal('[Date: Wed, 01 Jan 2014 00:00:00 GMT]');

		expect(iexpect._toString(new TypeError('abc'))).to.equal('[TypeError: abc]');
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
			iexpect.expect(shouldntThrow).not.toThrow();
		};

		var badExpect = function() {
			iexpect.expect(shouldThrow).not.toThrow();
		};

		expectNoThrow();

		expect(expectNoThrow).to.not.throw();
		expect(badExpect).to.throw("Expected [Function: anonymous] not to throw but [TypeError: Cannot read property 'thing' of undefined] was thrown");
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
			iexpect.expect(shouldntThrow).toThrow();
		};

		var expectTheThrow = function() {
			var thrownError;

			iexpect.expect(shouldThrow).toThrow();
		};

		expect(expectTheThrow).to.not.throw();
		expect(badExpect).to.throw("Expected [Function: anonymous] to throw");
	});

	it('throw with error spec', function() {
		var shouldThrow = function() {
			var obj = void 0;
			return obj.thing.thing;
		};

		var expectTheThrow = function() {
			var thrownError;

			iexpect.expect(shouldThrow).toThrow(TypeError);
			iexpect.expect(shouldThrow).toThrow("Cannot read property 'thing' of undefined");
			iexpect.expect(shouldThrow).toThrow(TypeError, "Cannot read property 'thing' of undefined");
			iexpect.expect(shouldThrow).toThrow("Cannot read property 'thing' of undefined", TypeError);
			
			try {
				shouldThrow();
			} catch(e) {
				thrownError = e;
			}

			iexpect.expect(shouldThrow).toThrow(thrownError);
			iexpect.expect(shouldThrow).not.toThrow("fake error message");
		};

		var badExpect1 = function() {
			function FakeError(){}

			iexpect.expect(shouldThrow).toThrow(FakeError);
		};

		var badExpect2 = function() {
			iexpect.expect(shouldThrow).toThrow('a fake error message');
		};

		var badExpect3 = function() {
			var newError = new RangeError();
			newError.message = 'fake error message';

			iexpect.expect(shouldThrow).toThrow(newError);
		};

		expect(shouldThrow).to.throw();
		expectTheThrow();

		expect(expectTheThrow).to.not.throw();

		expect(badExpect1).to.throw("Expected [Function: anonymous] to throw an error like [FakeError] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		expect(badExpect2).to.throw("Expected [Function: anonymous] to throw an error like [a fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		expect(badExpect3).to.throw("Expected [Function: anonymous] to throw an error like [RangeError: fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");

	});
});