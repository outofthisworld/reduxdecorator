
# Redux utils
Redux utils is a simple utility library to make it easier for working with redux,
and reduces the need to create unecessary duplicate code for trivial tasks that
are performed on state. It is defined as a single UMD module and can be viewed
in index.js. It has been bundled/combined with rollup and transpiled with babel to produce the final output and thus should work on the majority of browsers out there.

# Installation
## via npm
    ```bash
        npm install redux_utils --save
    ```
## in browser environments
[Minified script](https://raw.githubusercontent.com/outofthisworld/redux_utils/master/redux_utils.min.js)
[Non-minified script](https://raw.githubusercontent.com/outofthisworld/redux_utils/master/redux_utils.js)
### CDN
    ####todo
    

# How does redux utils help?

Assume we have a simple todo application, and thus have to model a todos state.
We might end up writing a reducer that looks like this:

```javascript
    import { createStore } from 'redux';

    const todos = (state=[],action)=>{
        switch(action.type){
            case 'ADD_TODO':
                //Code to add todo
                break;
            case 'REMOVE_TODO':
                //Code to remove todo
                break;
            default:
                return state;
        }
    }

    const TodoReducer = (state={},action) => {
        return {
            todos:todos(state,action);
        }
    }

    export default createStore(TodoReducer);
```

This is fine for a simple application, but what if we have another list in our state we need to model? We refactor and may get something like this:

```javascript
    import { createStore } from 'redux';

    const todos = (state=[],action)=>{
        switch(action.type){
            case 'ADD_TODO':
                //Code to add todo
                break;
            case 'REMOVE_TODO':
                //Code to remove todo
                break;
            default:
                return state;
        }
    }

    const notes = (state=[],action)=>{
        switch(action.type){
            case 'ADD_NOTE':
                //Code to add note
                break;
            case 'REMOVE_NOTE':
                //Code to remove note
                break;
            default:
                return state;
        }
    }

    const state = (state={},action) => {
        return {
            todos:todos(state,action),
            notes:notes(state,action)
        }
    }

    export default createStore(state);
```

As you can see, both these things are effectively doing the same thing. Adding and removing
an item from an array and ensuring that the original state is not modified (no side effects)

This could have been modeled like this also:

```javascript
    import { createStore } from 'redux';

    const array_reducer = (state=[],action)=>{
        switch(action.type){
            case 'ADD_TODO':
            case 'ADD_NOTE':
                //Code to add todo and note
                break;
            case 'REMOVE_TODO':
            case 'REMOVE_NOTE':
                //Code to remove todo and note
                break;
            default:
                return state;
        }
    }

    const state = (state={},action) => {
        return {
            todos:array_reducer(state,action),
            notes:array_reducer(state,action)
        }
    }
    export default createStore(state);
```

## What's your point?

This is a simpler alternative, far less code required. However, the problem is
that it is brittle. Keys have to be manually added to the switch statement
every time a new array is added to state. Another problem with this approach,
is that if slightly different functionality is required when adding todos or notes,
this code breaks.

The examples above are trivial, but the highlight a key point in that reducers
should be generic, easily usable in any circumstance for any type of data.
Redux utils provides a set of functions to help creating reducers easy.
It also provides an a function which operates on a object modeled by reducers
making working with state alot easier.

## Available utility functions
Note that the first invocation of any utility function is always the key for the action.type.  

### Utility functions operating on arrays:
#### array_append
```javascript
       /*
          array_append returns a function which takes a callback
          which takes the current state and action, and should
          return the new item to be added to the list.
       */
       array_append('ADD_TODO')((state, action) =>{
                return {
                    id: state.length + 1,
                    message: action.message
                }
       })

       /* What is returned? */
       const reducer = (state,action)=>{
           switch(action.type){
                case 'ADD_TODO':
                        //(Available from within closure)
                        const itemToAdd = callback(state,action);
                        const newState = [...state,itemToAdd];
                        return newState;
                    default:
                        return state;
           }
       }
       
```
#### array_remove_index
#### array_set
#### array_remove_all

### Utility functions operating on booleans:
#### boolean_toggle
#### boolean_set

### Utility functions operating on numbers:
#### number_transform


# Defining a state tree
```javascript 
let store;
const state = {
    todoPortion: {
        todos: [
            //Return the new objet to add to the array
            array_append('ADD_TODO')((state, action) =>{
                console.log('adding item')
                return {
                    id: state.length + 1,
                    message: action.message
                }
            }),
            //Return the index to remove
            array_remove_index('REMOVE_TODO')(function(state, action){
                console.log('returning index')
                return action.index
            }),
            //Return the new array to set the current array to.
            array_set('SET_TODOS')((state,action)=>[...action.todos]),
            //Sets the state to a new array automagically!
            array_remove_all('REMOVE_ALL_TODOS'),
            //Remove one item
            //array_filter('REMOVE_TODOS_MATCHING')((f)=> f.index != action.index),
            //array_map('TRANSFORM_TODOS')((f)=> ({...f,newProp:1}))
            default_state([{id:111,message:'some message'}])
        ],
        anotherComplexObj:{
            val:2,
            anotherList:[
                array_append('ADD_TO_ANOTHER_LIST')((state, action) =>{
                    console.log('adding item')
                    return {
                        id: state.length + 1,
                        val:action.val
                    }
                }),
                default_state(40)
            ]
        }
    },
    count: [
        number_transform('INCREMENT_COUNT')((state, action) =>  state + action.amount),
        default_state(30)
    ],
    toggleBool: [
        //truthify('IS_ON'),
        //falsify('IS_OFF'),
        //boolean_false(),
        //boolean_true(),
        //boolean_set(),
        boolean_toggle('TOGGLE_STATE'),
        //set_bool('SWITCH')(action.toogleBool)
        default_state(true)
    ],
    //A constant value that cannot be changed
    someVal:1
}
```