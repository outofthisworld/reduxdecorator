const assert = require("assert");
const { array_append } = require("../index");

describe("Array", function() {
  describe("#array_append", function() {
    it("Should return one argument function", function() {
      const ret = array_append("KEY");
      assert.equal(ret.length, 1);
    });

    it("Calls the appropriate callback", function(done) {
      const ret = array_append("KEY");
      let called = false;
      const reducer = ret(function(state, action) {
        called = true;
      });
      reducer([], { type: "KEY" });
      if (!called) {
        done(new Error("Callback not called"));
      } else {
        done();
      }
    });

    it("Has key assigned", function() {
      const reducer = array_append("key")(function() {});
      assert.deepEqual(reducer.reduxredup_key, "key");
    });

    it("Should append item to state", function() {
      let state = [];
      const action = {
        type: "KEY"
      };

      const reducer = array_append("KEY")(function(state, action) {
        return {
          id: 1
        };
      });

      state = reducer(state, action);
      assert.equal(state.length, 1);
      const [item] = state;
      assert.notEqual(item, undefined);
      assert.notEqual(item, null);
      assert.deepEqual(item, { id: 1 });
    });

    it("Should be the last item in the state", function() {
      let state = [{ id: 1 }];
      const action = {
        type: "KEY"
      };

      const reducer = array_append("KEY")(function(state, action) {
        return {
          id: 2
        };
      });

      const newState = reducer(state, action);
      const [first, second] = newState;
      assert.equal(second.id, 2);
      assert.notEqual(newState, state);
    });

    it("Should append item to state not not modifying original state", function() {
      let state = [];
      const action = {
        type: "KEY"
      };

      const reducer = array_append("KEY")(function(state, action) {
        return {
          id: 1
        };
      });

      const newState = reducer(state, action);
      assert.notEqual(newState, state);
      assert.notDeepEqual(newState, state);
      assert.notStrictEqual(newState, state);
      assert.notDeepStrictEqual(newState, state);
      if (newState === state) {
        throw new Error("Original array modified");
      }
    });
  });
});
