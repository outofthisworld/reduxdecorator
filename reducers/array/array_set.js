import simple_reducer from "../simple_reducer";

export default key => obj =>
  simple_reducer(key, (state, action) => {
    const newArr = obj(state, action);
    if (!Array.isArray(newArr)) {
      throw new Error("reduxredup error: array_set must return an array");
    }
    //The user modified the original array state
    if (newArr === state) {
      throw new Error(
        "reduxredup error: original array was returned from array_set, please make sure you copy the state."
      );
    }
    return newArr;
  });
