export default (key, callback, def) => {
  const simple_reducer_ret = (state = def, action = {}) => {
    switch (action.type) {
      case key:
        state = callback(state, action);
    }
    return state;
  };
  simple_reducer_ret.reduxredup_key = key;
  return simple_reducer_ret;
};
