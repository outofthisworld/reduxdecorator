const assert = require("assert");
const { array_remove_index } = require("../index");

describe("Array", function() {
  describe("#array_remove_index", function() {
    it("Deletes an object from state with the returned index", function() {
      const state = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const action = {
        type: "key"
      };

      const indexToRemove = 1;

      const reducer = array_remove_index("key")(function(state, action) {
        return indexToRemove;
      });

      const newState = reducer(state, action);
      assert.equal(newState.length, 2);
      assert.notDeepStrictEqual(newState, state);
      const [itemOne, itemTwo] = newState;
      assert.equal(itemOne.id, 1);
      assert.equal(itemTwo.id, 3);
    });
  });
});
