const assert = require("assert");
const { number_transform } = require("../index");

describe("Number", function() {
  describe("#number_transform", function() {
    it("Transforms a number", function() {
      const state = 7;
      const action = {
        type: "key",
        amount: 22
      };
      const reducer = number_transform("key")(function(state, action) {
        return action.amount + state;
      });
      const newState = reducer(state, action);
      assert.deepStrictEqual(state + action.amount, newState);
    });
  });
});
