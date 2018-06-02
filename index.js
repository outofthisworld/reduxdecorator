'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.redux_utils = factory();
})(undefined, function () {
    'use strict';

    function combine() {
        for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
        }

        return function (state, action) {
            return funcs.reduce(function (prev, cur) {
                if (typeof cur === 'function') {
                    return cur(prev, action);
                } else {
                    return prev;
                }
            }, state);
        };
    }

    var simple_reducer = function simple_reducer(key, callback) {
        return function (state) {
            var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            switch (action.type) {
                case key:
                    state = callback(state, action);
            }
            return state;
        };
    };

    var number_transform = function number_transform(key) {
        return function (func) {
            return simple_reducer(key, function (state, action) {
                return func(state, action);
            });
        };
    };

    var number_increment = function number_increment(key) {
        return simple_reducer(key, function (state, action) {
            return state + 1;
        });
    };

    var number_decrement = function number_decrement(key) {
        return simple_reducer(key, function (state, action) {
            return state - 1;
        });
    };

    var number_reducers = /*#__PURE__*/Object.freeze({
        number_transform: number_transform,
        number_increment: number_increment,
        number_decrement: number_decrement
    });

    var array_append = function array_append(key) {
        return function (obj) {
            return simple_reducer(key, function (state, action) {
                return [].concat(_toConsumableArray(state), [obj(state, action)]);
            });
        };
    };

    var array_prepend = function array_prepend(key) {
        return function (obj) {
            return simple_reducer(key, function (state, action) {
                return [obj(state, action)].concat(_toConsumableArray(state));
            });
        };
    };

    var array_remove_all = function array_remove_all(key) {
        return simple_reducer(key, function () {
            return [];
        });
    };

    var array_remove_index = function array_remove_index(key) {
        return function (index) {
            return simple_reducer(key, function (state, action) {
                var copy = [].concat(_toConsumableArray(state));
                var ind = index(state, action);

                if (!Number.isInteger(ind) || ind < 0 || ind >= copy.length) {
                    throw new Error('Redux_utils error: invalid index returned');
                }
                copy.splice(ind, 1);
                return copy;
            });
        };
    };

    var array_set = function array_set(key) {
        return function (obj) {
            return simple_reducer(key, function (state, action) {
                var newArr = obj(state, action);
                if (!Array.isArray(newArr)) {
                    throw new Error("Redux_utils error: array_set must return an array");
                }
                //The user modified the original array state
                if (newArr === state) {
                    throw new Error("Redux_utils error: original array was returned from array_set, please make sure you copy the state.");
                }
                return newArr;
            });
        };
    };

    var array_reducers = /*#__PURE__*/Object.freeze({
        array_append: array_append,
        array_prepend: array_prepend,
        array_remove_all: array_remove_all,
        array_reove_index: array_remove_index,
        array_set: array_set
    });

    var boolean_set = function boolean_set(key) {
        return function (func) {
            return simple_reducer(key, func);
        };
    };

    var boolean_toggle = function boolean_toggle(key) {
        return simple_reducer(key, function (state, action) {
            return !state;
        });
    };

    var boolean_reducers = /*#__PURE__*/Object.freeze({
        boolean_set: boolean_set,
        boolean_toggle: boolean_toggle
    });

    var def_state = function def_state(def) {
        return function () {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : def;
            var action = arguments[1];
            return state;
        };
    };

    var default_state = def_state;
    var simple_reducer$1 = simple_reducer;
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


    var reducers = /*#__PURE__*/Object.freeze({
        default_state: default_state,
        simple_reducer: simple_reducer$1,
        array_append: array_append$1,
        array_prepend: array_prepend$1,
        array_remove_all: array_remove_all$1,
        array_remove_index: array_remove_index$1,
        array_set: array_set$1,
        boolean_set: boolean_set$1,
        boolean_toggle: boolean_toggle$1,
        number_transform: number_transform$1,
        number_increment: number_increment$1,
        number_decrement: number_decrement$1
    });

    var exportObj = Object.assign({}, reducers, {
        create_reducer: function (_create_reducer) {
            function create_reducer(_x3) {
                return _create_reducer.apply(this, arguments);
            }

            create_reducer.toString = function () {
                return _create_reducer.toString();
            };

            return create_reducer;
        }(function (tree) {
            return function () {
                var prevState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var action = arguments[1];

                var isObject = function isObject(obj) {
                    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
                };

                if (!tree || !isObject(tree)) {
                    throw new Error('Invalid tree');
                }
                for (key in tree) {
                    var val = tree[key];
                    if (isObject(val)) {
                        prevState[key] = prevState[key] || {};
                        create_reducer(val)(prevState[key], action);
                    } else if (Array.isArray(val)) {
                        var reducer = combine.apply(null, val);
                        prevState[key] = reducer(prevState[key], action);
                    } else {
                        prevState[key] = val;
                    }
                }
                return prevState;
            };
        }),
        combine: combine
    });
    var main = Object.freeze(exportObj);

    return main;
});
