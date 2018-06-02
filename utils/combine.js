export default (...funcs) => (state, action) => {
  return funcs.reduce((prev, cur) => {
    if (typeof cur === "function") {
      return cur(prev, action);
    } else {
      return prev;
    }
  }, state);
};
