var assert = require("assert");
var Util = require("./../UtilFunctions");

describe("UtilFunctions", function(){

  describe("#getPathParams", function(){
    it("Should return empty object with { requested: '/some/url/' expected: '/some/url'}", function(){
        var requested = "/some/url";
        var expected = "/some/url";
        var pathParams = Util.getPathParams(requested, expected);
        assert.equal(Object.keys(pathParams).length, 0);
    });
    it("Should return one variable with { requested: '/some/url/with/a/myVar' expected: '/some/url/with/a/:variable'}", function(){
        var requested = "/some/url/with/a/myVar";
        var expected = "/some/url/with/a/:variable";
        var pathParams = Util.getPathParams(requested, expected);
        assert.equal(Object.keys(pathParams).length, 1);
        assert.equal(pathParams.variable, "myVar");
    });
    it("Should return multile variable with { requested: '/John/is/Happy' expected: '/:name/is/:desc'}", function(){
        var requested = "/John/is/Happy";
        var expected = "/:name/is/:desc";
        var pathParams = Util.getPathParams(requested, expected);
        assert.equal(Object.keys(pathParams).length, 2);
        assert.equal(pathParams.name, "John");
        assert.equal(pathParams.desc, "Happy");
    });
  })

  describe("#isVariable",function(){
    it("Should return true when the value is ':something'", function(){
      assert.equal(Util.isVariable(":something"), true);
    });
    it("Should return false when the value is 'something'", function(){
      assert.equal(Util.isVariable("something"), false);
    });
    it("Should return false when the value is 'something:'", function(){
      assert.equal(Util.isVariable("something:"), false);
    });
    it("Should return false when the value is 'some:thing'", function(){
      assert.equal(Util.isVariable("some:thing"), false);
    });
  })

});
