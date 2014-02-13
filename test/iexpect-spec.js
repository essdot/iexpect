iexpect = require('../app/iexpect');

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

	it('to have own property', function() {
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