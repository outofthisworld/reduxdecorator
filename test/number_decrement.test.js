const assert = require("assert");
const { number_decrement } = require("../index");

describe("Number", function() {
  describe("#number_decrement", function() {
    it("Decrements a number", function() {
      const state = 7;
      const action = {
        type: "key"
      };
      const reducer = number_decrement("key");
      const newState = reducer(state, action);
      assert.deepStrictEqual(newState, 6);
    });
  });
});
