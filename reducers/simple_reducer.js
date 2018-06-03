export default (key, callback) => {
  const simple_reducer = (state, action = {}) => {
    switch (action.type) {
      case key:
        state = callback(state, action);
    }
    return state;
  };
  simple_reducer.redux_utils_key = key;
  return simple_reducer;
};
