export { default as combine } from "./utils/combine.js";
export {
  array_append,
  array_prepend,
  array_remove_all,
  array_remove_index,
  array_set,
  boolean_set,
  boolean_toggle,
  number_transform,
  number_increment,
  number_decrement
} from "./reducers/index.js";
export function create_reducer(prevState = {}, action) {
  const isObject = obj =>
    obj === Object(obj) &&
    Object.prototype.toString.call(obj) !== "[object Array]";

  if (!tree || !isObject(tree)) {
    throw new Error("Invalid tree");
  }
  for (key in tree) {
    const val = tree[key];
    if (isObject(val)) {
      prevState[key] = prevState[key] || {};
      create_reducer(val)(prevState[key], action);
    } else if (Array.isArray(val)) {
      const reducer = combine.apply(null, val);
      prevState[key] = reducer(prevState[key], action);
    } else {
      prevState[key] = val;
    }
  }
  return prevState;
}
