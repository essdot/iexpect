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

		it('correctly handles NaN', function() {
			iexpect(NaN).toEqual(NaN);
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
			iexpect(NaN === NaN).toBeFalse();

			var badExpect1 = function badExpect1() {
				iexpect(true).toBeFalse();
			};

			var badExpect2 = function badExpect2() {
				iexpect(undefined).toBeFalse();
			};

			var badExpect3 = function badExpect3() {
				iexpect(123).toBeFalse();
			};

			chai.expect(badExpect1).to.throw('Expected true to be false');
			chai.expect(badExpect2).to.throw('Expected undefined to be false');
			chai.expect(badExpect3).to.throw('Expected 123 to be false');
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
			iexpect(Object).toBeA('function');
			iexpect(Array).toBeA('function');
		});

		it('detects numbers', function() {
			iexpect(77).toBeA('number');
			iexpect(Infinity).toBeA('number');
			iexpect(-Infinity).toBeA('number');
			iexpect(-0).toBeA('number');
			iexpect(0).toBeA('number');
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

		it('detects Error objects', function() {
			var e = new TypeError();
			iexpect(e).toBeAn('error');
		});

		it('detects booleans', function() {
			iexpect(true).toBeA('boolean');
			iexpect(false).toBeA('boolean');
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

			var badExpect4 = function() {
				iexpect(NaN).toBeA('number');
			};

			chai.expect(badExpect1).to.throw("Expected 77 to be a function");
			chai.expect(badExpect2).to.throw("Expected null to be an object");
			chai.expect(badExpect3).to.throw("Expected 'array' to be an array");
			chai.expect(badExpect4).to.throw("Expected NaN to be a number");
		});
	});

	describe('toDeepEqual', function(){
		it('handles deep equality of arrays', function() {
			var arr1 = [1, 2, 3];
			var arr2 = [1, 2, 3];
			var arr3 = [1, 2, 3];
			var arr4 = [1, 2, 3];
			arr3[6] = 6;

			iexpect(arr1).toDeepEqual([1, 2, 3]);
			iexpect(arr1).toDeepEqual(arr1);
			iexpect(arr1).toDeepEqual(arr2);

			iexpect(arr1.concat([9, 16])).toDeepEqual([1, 2, 3, 9, 16]);

			iexpect([]).toDeepEqual([]);

			iexpect(arr3).not.toDeepEqual(arr4);
			arr4[6] = 6;
			iexpect(arr3).toDeepEqual(arr4);

			var badExpect1 = function badExpect1() {
				iexpect(arr1).toDeepEqual([1, 2, 3, 4]);
			};

			var badExpect2 = function badExpect2() {
				iexpect(arr1).toDeepEqual([ 3, 2, 1 ]);
			};

			chai.expect(badExpect1).to.throw(iexpect.AssertError, 'Expected [1, 2, 3] to deeply equal [1, 2, 3, 4]');
			chai.expect(badExpect2).to.throw(iexpect.AssertError, 'Expected [1, 2, 3] to deeply equal [3, 2, 1]');
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

	describe('toThrow', function() {
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

		it('tests that function does not throw', function() {
			expectNoThrow();

			chai.expect(expectNoThrow).to.not.throw();
			chai.expect(badExpect1).to.throw("Expected [Function: anonymous] not to throw but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		});

		it('tests that function throws any error', function() {
			chai.expect(expectTheThrow).to.not.throw();
			chai.expect(badExpect2).to.throw("Expected [Function: anonymous] to throw");
		});

		it('tests that function throws the error specified by type', function() {
			iexpect(shouldThrow).toThrow(TypeError);
		});

		it('tests that function throws the error specified by error message', function() {
			iexpect(shouldThrow).toThrow("Cannot read property 'thing' of undefined");
		});

		it('tests that function throws the error specified by type and error message', function() {
			iexpect(shouldThrow).toThrow(TypeError, "Cannot read property 'thing' of undefined");
			iexpect(shouldThrow).toThrow("Cannot read property 'thing' of undefined", TypeError);
		});

		it('tests that function throws the error specified by error object', function() {
			var thrownError;

			try {
				shouldThrow();
			} catch(e) {
				thrownError = e;
			}

			iexpect(shouldThrow).toThrow(thrownError);
		});

		it('tests that function does not throw a different error than specified', function() {
			iexpect(shouldThrow).not.toThrow("fake error message").and.not.toThrow("another fake error message");

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

			chai.expect(badExpect1).to.throw("Expected [Function: anonymous] to throw an error like [FakeError] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
			chai.expect(badExpect2).to.throw("Expected [Function: anonymous] to throw an error like [a fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
			chai.expect(badExpect3).to.throw("Expected [Function: anonymous] to throw an error like [RangeError: fake error message] but [TypeError: Cannot read property 'thing' of undefined] was thrown");
		});

	});
});