import simple_reducer from "../reducers/simple_reducer";

export default function redup(objKey, actionType, initialState, ...args) {
  return function redup_return(target, key, descriptor) {
    const descriptorCopy = { ...descriptor };
    descriptorCopy.writable = false;
    descriptorCopy.enumerable = false;

    const nested = objKey.indexOf(".") != -1;

    if (nested) {
      const originalTarget = target;
      const splitKey = objKey.split(".");

      for (let i = 0; i < splitKey.length - 1; i++) {
        const key = splitKey[i];
        if (!(key in target)) {
          target[key] = {};
        }
        target = target[key];
      }

      objKey = splitKey[splitKey.length - 1];
    }

    const reducer =
      "initializer" in descriptor ? descriptor.initializer() : descriptor.value;
    if (typeof reducer !== "function") {
      throw new Error(
        "redux_redup: Invalid reducer function " + reducer.toString()
      );
    }

    if (target[objKey]) {
      if (!Array.isArray(target[objKey])) throw new Error("Invalid target");
      const arr = target[objKey];
      arr[arr.length] = simple_reducer(actionType, reducer, initialState);
    } else {
      target[objKey] = [simple_reducer(actionType, reducer, initialState)];
    }
    return descriptorCopy;
  };
}
