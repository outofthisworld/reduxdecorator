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
export function create_reducer(tree, { useCache = false }) {
  const create_reducer_ret = (prevState = {}, action) => {
    const isObject = obj =>
      obj === Object(obj) &&
      Object.prototype.toString.call(obj) !== "[object Array]";

    if (!tree || !isObject(tree)) {
      throw new Error("Invalid tree");
    }

    const cacheHasKey = key =>
      useCache &&
      create_reducer_ret.cache &&
      cache[key] &&
      typeof cache[key] === "function";

    const callReducers = (prev, cur) => {
      if (typeof cur === "function") {
        //Lazy load items into cache
        if (cur.redux_utils_key && !cacheHasKey(cur.redux_utils_key)) {
          cache[cur.redux_utils_key] = cur;
        }
        return cur(prev, action);
      } else {
        return prev;
      }
    };

    if (cacheHasKey(action.type)) {
      const reducer = cache[action.type];
      prevState[key] = reducer(prevState[key], action);
    } else {
      for (key in tree) {
        const val = tree[key];
        if (isObject(val)) {
          prevState[key] = prevState[key] || {};
          create_reducer(val)(prevState[key], action);
        } else if (Array.isArray(val)) {
          prevState[key] = val.reduce(callReducers, prevState[key]);
        } else {
          prevState[key] = val;
        }
      }
    }
    return prevState;
  };
  create_reducer.cache = {};
  return create_reducer_ret;
}
