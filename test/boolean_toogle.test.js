const assert = require("assert");
const { boolean_toggle } = require("../index");

describe("Boolean", function() {
  describe("#boolean_toggle", function() {
    it("Toggles a boolean", function() {
      const state = true;
      const reducer = boolean_toggle("key");

      const newState = reducer(state, { type: "key" });
      assert.deepStrictEqual(newState, false);
    });
  });
});
