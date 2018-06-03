const assert = require("assert");
const { boolean_set } = require("../index");

describe("Boolean", function() {
  describe("#boolean_set", function() {
    it("sets state to the specified boolean", function() {
      const state = true;
      const reducer = boolean_set("key")(function(state, action) {
        return false;
      });
      const newState = reducer(state, { type: "key" });
      assert.equal(newState, false);
    });
  });
});
