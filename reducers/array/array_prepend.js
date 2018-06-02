import simple_reducer from "../simple_reducer";
export default key => obj =>
  simple_reducer(key, (state, action) => [obj(state, action), ...state]);
