export default (key, callback) => {
  return (state, action = {}) => {
    switch (action.type) {
      case key:
        state = callback(state, action);
    }
    return state;
  };
};
