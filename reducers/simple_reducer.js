export default (key, callback) => {
  const simple_reducer_ret = (state, action = {}) => {
    switch (action.type) {
      case key:
        state = callback(state, action);
    }
    return state;
  };
  simple_reducer_ret.redux_utils_key = key;
  return simple_reducer_ret;
};
