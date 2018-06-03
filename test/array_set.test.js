const assert = require("assert");
const { array_set } = require("../index");

describe("Array", function() {
  describe("#array_set", function() {
    it("Sets the array to the specified array", function() {
      const state = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const action = {
        type: "key",
        newState: [{ id: 5 }, { id: 6 }]
      };

      const reducer = array_set("key")(function(state, action) {
        return action.newState;
      });

      const newState = reducer(state, action);
      assert.notDeepEqual(newState, state);
      assert.notEqual(state.length, newState.length);
      assert.equal(newState.length, action.newState.length);
      const [itemOne, itemTwo] = newState;
      assert.equal(itemOne.id, 5);
      assert.equal(itemTwo.id, 6);
    });
  });
});
