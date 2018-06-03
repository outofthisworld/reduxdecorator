const assert = require("assert");
const { array_prepend } = require("../index");

describe("Array", function() {
  describe("#array_prepend", function() {
    it("Should return one argument function", function() {
      const ret = array_prepend("KEY");
      assert.equal(ret.length, 1);
    });

    it("calls the appropriate callback", function() {
      let callbackCalled = false;
      const reducer = array_prepend("key")(function() {
        callbackCalled = true;
      });

      const state = [];
      const action = {
        type: "key"
      };
      reducer(state, action);
      assert.equal(callbackCalled, true);
    });

    it("Has key assigned", function() {
      const reducer = array_prepend("key")(function() {});
      assert.deepEqual(reducer.redux_utils_key, "key");
    });

    it("adds item to state", function() {
      const state = [];

      const action = {
        type: "key"
      };

      const reducer = array_prepend("key", function(state, action) {
        return {
          id: 1
        };
      });

      const newState = reducer(state, action);
      assert.equal(newState.length, 1);
      assert.notEqual(newState, state);
      assert.notDeepStrictEqual(newState, state);
    });
  });
});
