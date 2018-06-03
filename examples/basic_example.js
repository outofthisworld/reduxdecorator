/*
  A messy but complete example of using reduxreduce.
*/
const { createStore } = require("redux");
const {
  create_reducer,
  combine,
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
  default_state
} = require("reduxreduce"); //Same as require('reduxreduce');

let store;

let reducer_tree = {
  todoPortion: {
    todos: [
      //Return the new objet to add to the array
      array_append("ADD_TODO")((state, action) => {
        return {
          id: state.length + 1,
          message: action.message
        };
      }),
      //Return the index to remove
      array_remove_index("REMOVE_TODO")(function(state, action) {
        return action.index;
      }),
      //Return the new array to set the current array to.
      array_set("SET_TODOS")((state, action) => [...action.todos]),
      //Sets the state to a new array automagically!
      array_remove_all("REMOVE_ALL_TODOS"),
      //Remove one item
      //array_filter('REMOVE_TODOS_MATCHING')((f)=> f.index != action.index),
      //array_map('TRANSFORM_TODOS')((f)=> ({...f,newProp:1}))
      default_state([{ id: 111, message: "some message" }])
    ],
    anotherComplexObj: {
      val: 2,
      anotherList: [
        array_append("ADD_TO_ANOTHER_LIST")((state, action) => {
          return {
            id: state.length + 1,
            val: action.val
          };
        }),
        default_state(40)
      ]
    }
  },
  count: [
    number_transform("INCREMENT_COUNT")(
      (state, action) => state + action.amount
    ),
    default_state(30)
  ],
  toggleBool: [
    //truthify('IS_ON'),
    //falsify('IS_OFF'),
    //boolean_false(),
    //boolean_true(),
    //boolean_set(),
    boolean_toggle("TOGGLE_STATE"),
    //set_bool('SWITCH')(action.toogleBool)
    default_state(true)
  ],
  //A constant value that cannot be changed
  someVal: 1
};
const final_reducer = create_reducer(reducer_tree);
store = createStore(final_reducer);

store.subscribe(function() {
  console.log("=== STATE === ");
  console.log(store.getState());
  console.log("Todos:");
  console.log(store.getState().todoPortion.todos);
  console.log("create_reducer cache");
  console.log(final_reducer.cache);
  for (key in final_reducer.cache) {
    console.log(`${key} = ${typeof final_reducer.cache[key]}`);
  }
  console.log("=== STATE === ");
});

console.log("==INITIAL STATE:==");
console.log(store.getState());
console.log("Todos:");
console.log(store.getState().todoPortion.todos);
console.log("==================");

console.log("== ADDING TODO ==");
store.dispatch({
  type: "ADD_TODO",
  message: "hello world!"
});
console.log("==================");

console.log("=== ADDING TODO ==");
store.dispatch({
  type: "ADD_TODO",
  message: "goodbye world!"
});
console.log("==================");

console.log("=== REMOVING TODO (index 0) ==");
store.dispatch({
  type: "REMOVE_TODO",
  index: 0
});
console.log("==================");

console.log("=== INCREMENTING COUNT BY 10 ==");
store.dispatch({
  type: "INCREMENT_COUNT",
  amount: 10
});
console.log("==================");

console.log("=== INCREMENTING COUNT BY 10 ==");
store.dispatch({
  type: "INCREMENT_COUNT",
  amount: 10
});
console.log("==================");
console.log("=== TOGGLING STATE ==");
store.dispatch({
  type: "TOGGLE_STATE"
});
console.log("==================");
console.log("=== TOGGLING STATE AGAIN ==");
store.dispatch({
  type: "TOGGLE_STATE"
});
console.log("==================");

const assert = other => {
  if (!other) {
    throw new Error("Invalid test assertation");
  }
};
const testAddTodo = () => {
  const appendTodo = reducer_tree.todoPortion.todos[0];

  const action = {
    type: "ADD_TODO",
    message: "Todo message"
  };

  const state = [];

  const newState = appendTodo(state, action);

  assert(Array.isArray(newState));
  assert(newState.length == 1);
  assert(newState !== state);
};

const testArrSet = () => {
  const reducer = array_set("key")(function(state, action) {
    return [...action.todos];
  });

  assert(typeof reducer === "function");
  const todos = [{ id: 1, message: "hi" }];
  const state = [];
  assert(state.length == 0);
  const out = reducer(state, {
    type: "key",
    todos
  });

  assert(Array.isArray(out));
  assert(todos !== out);
  assert(out.length == 1);
  assert(out[0].id == 1);
  assert(out[0].message === "hi");
};

const testSetTodos = () => {
  const setTodos = reducer_tree.todoPortion.todos[2];

  const state = [
    { id: 1, message: "first todo" },
    { id: 2, message: "second todo" }
  ];

  const action = {
    type: "SET_TODOS",
    todos: [{ id: 1, message: "first todo modified" }]
  };

  const newState = setTodos(state, action);
  assert(Array.isArray(newState));
  assert(newState.length == 1);
  //assert(false, newState === state);
  // const message = newState[0];
  // assert(true,message.id === 1);
  // assert(true,message.message == 'first todo modified');
};

const testHaveReduxUtilsKey = () => {
  const reducer = array_set("key")(function(state, action) {
    return [...action.todos];
  });

  const append_reducer = array_append("append")(function(state, action) {
    return [...action.todos];
  });

  assert(reducer.reduxreduce_key === "key");
  assert(append_reducer.reduxreduce_key === "append");
};

testAddTodo();
testArrSet();
testSetTodos();
testHaveReduxUtilsKey();
console.log("Succesfully ran tests");
