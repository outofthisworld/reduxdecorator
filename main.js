export { default as combine } from "./utils/combine";
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
  number_decrement,
  simple_reducer,
  default_state
} from "./reducers/index";
export { redup } from "./annotations/index";

export function create_reducer(tree, options = {}, cache = {}, nested = []) {
  function create_reducer_ret(prevState = {}, action) {
    const cacheHasKey = key => cache && cache[key];
    const optionsCopy = Object.assign({}, options);

    if (!("useCache" in optionsCopy)) {
      optionsCopy.useCache = true;
    }

    const isObject = obj =>
      obj === Object(obj) &&
      Object.prototype.toString.call(obj) !== "[object Array]";

    if (!tree || !isObject(tree)) {
      throw new Error("Invalid tree");
    }

    const callReducers = nested => (prev, cur) => {
      if (typeof cur === "function") {
        //Lazy load items into cache
        if (cur.reduxredup_key && optionsCopy.useCache) {
          cur.reduxredup_property = [...nested];
          cache[cur.reduxredup_key] = cur;
        }
        return cur(prev, action);
      } else {
        return prev;
      }
    };

    if (
      cacheHasKey(action.type) &&
      typeof cache[action.type] === "function" &&
      "reduxredup_property" in cache[action.type] &&
      optionsCopy.useCache
    ) {
      const reducer = cache[action.type];
      if (!("reduxredup_property" in reducer)) {
        throw new Error("Missing reduxredup_property");
      }

      const properties = reducer.reduxredup_property;
      const last = properties[properties.length - 1];
      const nextToLast = properties[properties.length - 2];

      if (properties.length == 1) {
        prevState[properties[0]] = reducer(prevState[properties[0]], action);
      } else {
        let current = null;
        for (let i = 0; i < properties.length - 1; i++) {
          current = prevState[properties[i]];
        }
        current[last] = reducer(current[last], action);
      }
    } else {
      for (let key in tree) {
        const val = tree[key];
        nested[nested.length] = key;
        if (isObject(val)) {
          prevState[key] = prevState[key] || {};
          create_reducer(val, options, cache, nested)(prevState[key], action);
        } else if (Array.isArray(val)) {
          prevState[key] = val.reduce(callReducers(nested), prevState[key]);
        } else {
          prevState[key] = val;
        }
        nested = [];
      }
    }
    return prevState;
  }
  return create_reducer_ret;
}
