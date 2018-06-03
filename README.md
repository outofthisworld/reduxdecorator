
# Redux utils
Redux utils is a simple utility library to make it easier for working with redux,
and reduces the need to create unecessary duplicate code for trivial tasks that
are performed on state. It is defined as a single UMD module and can be viewed
in index.js. It has been bundled/combined with rollup and transpiled with babel to produce the final output and thus should work on the majority of browsers out there.

# Contributing
Feel free to contribute to redux_utils by issuing a pull request if you have an idea or want to write some tests. Currently aiming for 100% code coverage which shouldn't be too dificult as there is a small amount of code.

# Size
Minified version of redux utils currently sits at 3.95kb which is tiny ! :)

# Installation
## Via npm
```bash
    npm install redux_utils --save
```
## Browser environments
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

# Creating the state with redux utils
Redux utils provides a set of useful set of utility methods (scroll down to see the list)
which return reducers. The above can be modeled using redux_utils:
```javascript
    import { createStore } from 'redux';
    import { array_append, create_reducer,default_state } from 'redux_utils';
    const reducer_tree = {
        todos:[
            //Return the todo to be added
            array_append('ADD_TODO')((state, action) =>{
                return {
                    id: state.length + 1,
                    message: action.message
                }
            }),
            default_state([])

        ],
        notes:[
            //Return the note to be added
            array_append('ADD_NOTE')((state, action) =>{
                return {
                    id: action.id,
                    message: action.noteMessage
                }
            }),
            default_state([])
        ]
    }
    export default createStore(create_reducer(reducer_tree));
```

This may look a little different from what you are used to, however lets walk through the steps.

- We import createStore from redux, this is what we use to create a redux store.
- We import three functions from redux_utils array_append, create_reducer and default_state
    - All three functions return reducers! No fancy magic.
- We define our reducer tree, a reducer tree is a simple object mapping of object   properties to arrays of reducers which perform actions on that specific property.
It's important to realise that array_append and default_state both return reducers.
You can also specify your own reducers inside an array, incase there isn't a redux utility
function to do what you need.
- create_reducer is where the magic happens. It will combine the reducers specified
  for a certain property in the reducer tree, and call each one in the order they were defined.

After we have created our store, we can now dispatch the following actions on the store:
```javascript
    store.dispatch({
        type:'ADD_NOTE',
        id:1,
        noteMessage:'This is a message for a note'
    })

    store.dispatch({
        type:'ADD_TODO',
        message:'This is a message for a todo!'
    })
```
With this in place have successfully combated our initial problems with the code being brittle. We have seperated our concerns, both adding a note and adding a todo. Their associated logic can be changed with ease to accomadate the differences. Further more,
we now have a key to associate with each reducer, namely the the action.type you give to it. This means that we can later cache this, so not all reducers in the application have to be invoked to target the one that needs to be invoked.

#### You may have some question related to the previous code:
---
1. What does default_state([]) do?
---
   Default state is used to define the data type of the object property/key.
   Above, it specifies todos and notes as both being arrays.
   Internally, it returns a reducer:
```javascript
    const default_state = (defaultState) => (state=defaultState,action)=> state;
```

   If state is undefined, state will be set to defaultState and the state returned.
   As such this is used for when redux calls reducers with an undefined state to obtain their initial state. Any time an object key is specified as an array of reducers
   (which is most of the time), default_state should be provided in order to determine
   the keys initial state.

---
2. What about more complex state ?
---
    Most usecases should be handled. The following is an example of a more complex
    object:
```javascript 
        const state = {
            todoPortion:{
                todos:[
                    default_state([])
                ],
                someOtherPortion:{
                    anotherList:[
                        default_state([])
                    ]
                }
            },
            someVar:1
        }
```
    Your initial redux store state with using the above reducer tree will be:
```javascript 
        const state = {
            todoPortion:{
                todos:[],
                someOtherPortion:{
                    anotherList:[]
                }
            },
            someVar:1
        }
```
---
3. How can I do more complex operations on an array, for instance remove certain items?
---
Set array allows you to return a new array which will be set as the state. This means
that you can use common map/filter/reduce functions on the current state and return a new array. Under the hood, array_set checks to make sure that the returned item is infact
an array and that it is not the same as state to avoid issues by accidently modifying the array. Even if you do nothing with the state when using array_set, you should still return
a new array.
```javascript
    //Remove the todo with action.index (trivial example, use array_remove_index)
    array_set('SET_TODOS')((state,action)=> state.filter((todo)=> todo.id !== action.index))
    //Return a new list of todos where each todo message has been transformed 
    //to its uppercase variant.
    array_set('TRANSFORM_TODOS')((state,action)=> state.map((todo)=>{
        todo.message = todo.message.toUpperCase();
        return todo;
    }))
```
---
4. What if I can't find a utility function that fits my needs?
---
Lets assume there isn't a utility function for prepending an item to an array.
And we wanted to be able to insert todo objects to the begging of the todos array.
This can easily be accomplished by specifying your own reducer:
```javascript 
        todos:[
            //Return the todo to be added
            array_append('ADD_TODO')((state, action) =>{
                return {
                    id: state.length + 1,
                    message: action.message
                }
            }),
            //Specify our own reducer, which takes the current state
            //and returns a new array with a new todo object prepended to the begging.
            (state,action)=> [{id:state.length+1,message:action.message},...state],
            default_state([])

        ]
```
---
5. Why is append prefixed with array_ ?
---
All utility functions are prefixed by the types that they operate on. This include number,boolean and arrays. For example `array_prepend`, `number_transform`, `boolean_set`. You may wonder why this is, and its simply because it makes it easier to think about the type of data that you're working on and it also is easier to find errors in you code. For example assume the following code:

```javascript
    const reducer_tree = {
        todos:[
            append()
            set()
            state([])
        ]
    }
```
When looking at this code, it may not be apparent that there is an error.
We have called `set()` which refers to `boolean_set`(with the prefix removed)
within a data type that has a default state of array type. `boolean_set` only works
with booleans, so this is not allowed. However, glancing at the code without the prefix
makes this harder to spot and thus leads to more confusion down the line. If you don't like
the names though that is easy to fix, simply import them as different names!
```javacript
    import { array_append as append } from 'redux_utils';
```
---

## Performance
Performance of redux_utils has not been benchmarked yet. However, theoritically it should
be more effecient than a large application with lots of reducers using switch statements.
This is because `create_reducer` returns a function which maintains a cache. Each function returned by redux_utils has a key property assigned to it, under the property `redux_utils_key` this key corresponds to the action.type. As such, if a key is found in the cache (which is lazily populated after the first store dispatch) then the reducer for that action.type/key can be invoked immediately without having to invoke every other reducer in the application.

The downside to mainitaining the cache mapping is that it requires more memory, this may or may not be what you would like and would rather sacrifice CPU cycles. In that case
you can explicity turn off use of caching when calling `create_reducer` as shown in the following example:
```javascript
    create_reducer(reducer_tree,{useCache:false});
```

## Available utility functions
Note that the first argument for the first invocation of any utility function is always the key for the action.type.  

### Utility functions operating on arrays:
#### array_append
```javascript
       /*
          array_append: adds a new item to an array.
          
          returns a function which takes a callback
          which takes the current state and action, and should
          return the new item to be added to the list.
       */
       array_append('ADD_TODO')((state, action) =>{
            //Return the todo to be added
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
#### array_prepend
```javascript
    array_prepend('PREPEND_TODO')((state, action) =>{
         //Return the todo to be added
        return {
            id: state.length + 1,
            message: action.message
         }
    })
```
#### array_remove_index
```javascript
     //Return the index in the array to remove
     array_remove_index('REMOVE_TODO')(function(state, action){
        console.log('returning index')
        return action.index
     })
```
#### array_set
```javascript
    //Set the array to the returned array
    array_set('SET_TODOS')((state,action)=>[...action.todos])
```
#### array_remove_all
```javascript
    //Remove all items from an array
    array_remove_all('REMOVE_ALL_TODOS')
```

### Utility functions operating on booleans:
#### boolean_toggle
```javascript
    //Toggle a boolean "On" or "Off"
    boolean_toggle('TOGGLE_STATE')
```
#### boolean_set
```javascript
    //Set boolean to return value
    boolean_set('SET')((state,action)=> false);
```

### Utility functions operating on numbers:
#### number_transform
```javascript
    //Transform a number, return the new number.
    number_transform('INCREMENT_COUNT')((state, action) =>  state + action.amount)
```


# Putting everything together
Below is a decent example of how you might define a reducer tree.
You make like to define different parts of your reducer
tree in seperate files if the state becomes large to help with readability
however this covers the concepts.
```javascript 
let store;
const state = {
    todoPortion: {
        todos: [
            //Return the new objet to add to the array
            //state argument will refer to state.todoPortion.todos
            array_append('ADD_TODO')((state, action) =>{
                return {
                    id: state.length + 1,
                    message: action.message
                }
            }),
            //Return the index to remove
            array_remove_index('REMOVE_TODO')(function(state, action){
                return action.index
            }),
            //Return the new array to set the current array to.
            array_set('SET_TODOS')((state,action)=>[...action.todos]),
            //Sets the state to a new array automagically!
            array_remove_all('REMOVE_ALL_TODOS'),
            //default value for todos key (already one todo!)
            default_state([{id:111,message:'some message'}])
        ],
        anotherComplexObj:{
            //This will stay as 2
            val:2,
            anotherList:[
                array_append('ADD_TO_ANOTHER_LIST')((state, action) =>{
                    console.log('adding item')
                    return {
                        id: state.length + 1,
                        val:action.val
                    }
                }),
                //default state for anotherList
                default_state([])
            ]
        }
    },
    count: [
        //Increment count (state) by action.amount
        number_transform('INCREMENT_COUNT')((state, action) =>  state + action.amount),
        //Default for count will be 30
        default_state(30)
    ],
    toggleBool: [
        //define a toggleBool to be toggleable
        boolean_toggle('TOGGLE_STATE'),
        //Make it true to begin with
        default_state(true)
    ],
    //A constant value that cannot be changed
    someVal:1
}

const store = createStore(create_reducer(state));

/*
   Now some of the actions you can dispatch are, but not limited to:
*/
store.dispatch({
    type:'ADD_TODO',
    message:'my new todo item!'
});
store.dispatch({
    type:'REMOVE_TODO',
    //index of the todo to remove...
    index:0
});
store.dispatch({
    type:'SET_TODOS',
    //Some new todoes to add...
    todos:[{},{}]
});
store.dispatch({
    type:'REMOVE_ALL_TODOS',
});
store.dispatch({
    type:'INCREMENT_COUNT',
    //increment count by 20.
    amount:20
});
```