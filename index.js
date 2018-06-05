"use strict";

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

(function(global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ===
    "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
      ? define(["exports"], factory)
      : factory((global.reduxdecorator = {}));
})(undefined, function(exports) {
  "use strict";

  var combine = function combine() {
    for (
      var _len = arguments.length, funcs = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      funcs[_key] = arguments[_key];
    }

    return function(state, action) {
      return funcs.reduce(function(prev, cur) {
        if (typeof cur === "function") {
          return cur(prev, action);
        } else {
          return prev;
        }
      }, state);
    };
  };

  var simple_reducer = function simple_reducer(key, callback, def) {
    var simple_reducer_ret = function simple_reducer_ret() {
      var state =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : def;
      var action =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      switch (action.type) {
        case key:
          state = callback(state, action);
      }
      return state;
    };
    simple_reducer_ret.reduxdecorator_key = key;
    return simple_reducer_ret;
  };

  var number_transform = function number_transform(key) {
    return function(func) {
      return simple_reducer(key, function(state, action) {
        return func(state, action);
      });
    };
  };

  var number_increment = function number_increment(key) {
    return simple_reducer(key, function(state, action) {
      return state + 1;
    });
  };

  var number_decrement = function number_decrement(key) {
    return simple_reducer(key, function(state, action) {
      return state - 1;
    });
  };

  var number_reducers = /*#__PURE__*/ Object.freeze({
    number_transform: number_transform,
    number_increment: number_increment,
    number_decrement: number_decrement
  });

  var array_append = function array_append(key) {
    return function(obj) {
      return simple_reducer(key, function(state, action) {
        return [].concat(_toConsumableArray(state), [obj(state, action)]);
      });
    };
  };

  var array_prepend = function array_prepend(key) {
    return function(obj) {
      return simple_reducer(key, function(state, action) {
        return [obj(state, action)].concat(_toConsumableArray(state));
      });
    };
  };

  var array_remove_all = function array_remove_all(key) {
    return simple_reducer(key, function() {
      return [];
    });
  };

  var array_remove_index = function array_remove_index(key) {
    return function(index) {
      return simple_reducer(key, function(state, action) {
        var copy = [].concat(_toConsumableArray(state));
        var ind = index(state, action);

        if (!Number.isInteger(ind) || ind < 0 || ind >= copy.length) {
          throw new Error("redux-decoratorerror: invalid index returned");
        }
        copy.splice(ind, 1);
        return copy;
      });
    };
  };

  var array_set = function array_set(key) {
    return function(obj) {
      return simple_reducer(key, function(state, action) {
        var newArr = obj(state, action);
        if (!Array.isArray(newArr)) {
          throw new Error(
            "redux-decorator error: array_set must return an array"
          );
        }
        //The user modified the original array state
        if (newArr === state) {
          throw new Error(
            "redux-decorator error: original array was returned from array_set, please make sure you copy the state."
          );
        }
        return newArr;
      });
    };
  };

  var array_reducers = /*#__PURE__*/ Object.freeze({
    array_append: array_append,
    array_prepend: array_prepend,
    array_remove_all: array_remove_all,
    array_remove_index: array_remove_index,
    array_set: array_set
  });

  var boolean_set = function boolean_set(key) {
    return function(func) {
      return simple_reducer(key, func);
    };
  };

  var boolean_toggle = function boolean_toggle(key) {
    return simple_reducer(key, function(state, action) {
      return !state;
    });
  };

  var boolean_reducers = /*#__PURE__*/ Object.freeze({
    boolean_set: boolean_set,
    boolean_toggle: boolean_toggle
  });

  function default_state(def) {
    return function default_state_ret() {
      var state =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : def;
      var action = arguments[1];

      return state;
    };
  }

  var array_append$1 = array_reducers.array_append,
    array_prepend$1 = array_reducers.array_prepend,
    array_remove_all$1 = array_reducers.array_remove_all,
    array_remove_index$1 = array_reducers.array_remove_index,
    array_set$1 = array_reducers.array_set;
  var boolean_set$1 = boolean_reducers.boolean_set,
    boolean_toggle$1 = boolean_reducers.boolean_toggle;
  var number_transform$1 = number_reducers.number_transform,
    number_increment$1 = number_reducers.number_increment,
    number_decrement$1 = number_reducers.number_decrement;

  function redup(objKey, actionType, initialState) {
    return function redup_return(target, key, descriptor) {
      var descriptorCopy = _extends({}, descriptor);
      descriptorCopy.writable = false;
      descriptorCopy.enumerable = false;

      var nested = objKey.indexOf(".") != -1;

      if (nested) {
        var splitKey = objKey.split(".");

        for (var i = 0; i < splitKey.length - 1; i++) {
          var _key2 = splitKey[i];
          if (!(_key2 in target)) {
            target[_key2] = {};
          }
          target = target[_key2];
        }

        objKey = splitKey[splitKey.length - 1];
      }

      var reducer =
        "initializer" in descriptor
          ? descriptor.initializer()
          : descriptor.value;
      if (typeof reducer !== "function") {
        throw new Error(
          "redux-decorator: Invalid reducer function " + reducer.toString()
        );
      }

      if (target[objKey]) {
        if (!Array.isArray(target[objKey])) throw new Error("Invalid target");
        var arr = target[objKey];
        arr[arr.length] = simple_reducer(actionType, reducer, initialState);
      } else {
        target[objKey] = [simple_reducer(actionType, reducer, initialState)];
      }
      return descriptorCopy;
    };
  }

  function create_reducer(tree) {
    var options =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var cache =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var nested =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    function create_reducer_ret() {
      var prevState =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments[1];

      var cacheHasKey = function cacheHasKey(key) {
        return cache && cache[key];
      };
      var optionsCopy = Object.assign({}, options);

      if (!("useCache" in optionsCopy)) {
        optionsCopy.useCache = true;
      }

      var isObject = function isObject(obj) {
        return (
          obj === Object(obj) &&
          Object.prototype.toString.call(obj) !== "[object Array]"
        );
      };

      if (!tree || !isObject(tree)) {
        throw new Error("Invalid tree");
      }

      var callReducers = function callReducers(nested) {
        return function(prev, cur) {
          if (typeof cur === "function") {
            //Lazy load items into cache
            if (cur.reduxdecorator_key && optionsCopy.useCache) {
              cur.reduxdecorator_property = [].concat(
                _toConsumableArray(nested)
              );
              cache[cur.reduxdecorator_key] = cur;
            }
            return cur(prev, action);
          } else {
            return prev;
          }
        };
      };

      if (
        cacheHasKey(action.type) &&
        typeof cache[action.type] === "function" &&
        "reduxdecorator_property" in cache[action.type] &&
        optionsCopy.useCache
      ) {
        var reducer = cache[action.type];
        if (!("reduxdecorator_property" in reducer)) {
          throw new Error("Missing reduxdecorator_property");
        }

        var properties = reducer.reduxdecorator_property;
        var last = properties[properties.length - 1];
        var nextToLast = properties[properties.length - 2];

        if (properties.length == 1) {
          prevState[properties[0]] = reducer(prevState[properties[0]], action);
        } else {
          var current = null;
          for (var i = 0; i < properties.length - 1; i++) {
            current = prevState[properties[i]];
          }
          current[last] = reducer(current[last], action);
        }
      } else {
        for (var key in tree) {
          var val = tree[key];
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

  exports.create_reducer = create_reducer;
  exports.combine = combine;
  exports.array_append = array_append$1;
  exports.array_prepend = array_prepend$1;
  exports.array_remove_all = array_remove_all$1;
  exports.array_remove_index = array_remove_index$1;
  exports.array_set = array_set$1;
  exports.boolean_set = boolean_set$1;
  exports.boolean_toggle = boolean_toggle$1;
  exports.number_transform = number_transform$1;
  exports.number_increment = number_increment$1;
  exports.number_decrement = number_decrement$1;
  exports.simple_reducer = simple_reducer;
  exports.default_state = default_state;
  exports.redup = redup;

  Object.defineProperty(exports, "__esModule", { value: true });
});
