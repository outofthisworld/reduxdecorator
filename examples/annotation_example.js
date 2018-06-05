const { createStore } = require("redux");
const { create_reducer, redup } = require("redux-decorator");

class Note {
  @redup("Notes", "AddNote", [])
  addNote(state, action) {
    const stateCopy = [...state, { note: true }];
    return stateCopy;
  }
}

class State {
  @redup("Todos", "AddTodo", [])
  addTodo(state, action) {
    return [...state, { id: 2 }];
  }
  @redup("Todos", "RemoveTodo", [])
  removeTodo(state, action) {
    console.log("running remove todo");
    const copy = [...state];
    copy.splice(action.index, 1);
    return copy;
  }
  notes = new Note();
}

const store = createStore(create_reducer(new State()));

console.log(store.getState());
store.dispatch({
  type: "AddTodo"
});
console.log(store.getState());
store.dispatch({
  type: "RemoveTodo"
});
console.log(store.getState());
store.dispatch({
  type: "AddNote"
});
console.log(store.getState());
