import simple_reducer from "../simple_reducer";

export default key => obj =>
  simple_reducer(key, (state, action) => [...state, obj(state, action)]);
