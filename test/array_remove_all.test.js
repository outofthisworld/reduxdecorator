const assert = require("assert");
const { array_remove_all } = require("../index");

describe("Array", function() {
  describe("#array_remove_all", function() {
    it("Removes all from state", function() {
      const state = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const action = {
        type: "key"
      };

      const reducer = array_remove_all("key");
      const newState = reducer(state, action);
      assert.deepEqual(newState.length, 0);
    });

    it("Returns a new object as state", function() {
      const state = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const action = {
        type: "key"
      };

      const reducer = array_remove_all("key");
      const newState = reducer(state, action);

      assert.notDeepStrictEqual(newState, state);
    });
  });
});
