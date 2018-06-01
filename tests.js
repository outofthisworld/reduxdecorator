const { createStore } = require('redux');
const {
    //Appends an array item
    array_append,
    //Removes all array items
    array_remove_all,
    //Removes the array item at the returned index
    array_remove_index,
    //Sets the array to the specified array
    array_set,
    //Set boolean to specified value
    boolean_set,
    //Toggles boolean to specified value
    boolean_toggle,
    //Transforms number to specified value
    number_transform,
    //Returns state, overrides if undefined.
    default_state,
    //Creates a reducer with one switch case using the given key
    simple_reducer,
    //Creates a final reducer from a given object
    create_reducer
} = require('./index');


/*
let store;
const s = {
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



store = createStore(create_reducer(s));

store.subscribe(function() {
    console.log('=== STATE === ');
    console.log(store.getState())
    console.log('=== STATE === ');
})

store.dispatch({
    type: 'ADD_TODO',
    message: 'hello world!'
})

store.dispatch({
    type: 'ADD_TODO',
    message: 'goodbye world!'
})

store.dispatch({
    type: 'REMOVE_TODO',
    index:0
})

store.dispatch({
    type: 'INCREMENT_COUNT',
    amount: 10
})

store.dispatch({
    type: 'INCREMENT_COUNT',
    amount: 10
})
store.dispatch({
    type: 'TOGGLE_STATE'
})
store.dispatch({
    type: 'TOGGLE_STATE'
})



const assert = (other)=>{
    if(!other){
        throw new Error('Invalid test assertation');
    }
}
const testAddTodo = ()=>{
    const appendTodo = s.todoPortion.todos[0];

    const action = {
        type:'ADD_TODO',
        message:'Todo message'
    }

    const state = []

    const newState = appendTodo(state,action);

    assert(Array.isArray(newState));
    assert(newState.length == 1);
    assert(newState !== state);
}

const testArrSet = ()=>{
    const reducer = array_set('key')(function(state,action){
        return [...action.todos];
    });

    assert(typeof reducer === 'function');
    const todos = [{id:1,message:'hi'}];
    const state = []
    assert(state.length==0);
    const out = reducer(state,{
        type:'key',
        todos
    });

    assert(Array.isArray(out));
    assert(todos !== out)
    assert(out.length == 1);
    assert(out[0].id == 1);
    assert(out[0].message==='hi');

}

const testSetTodos = ()=>{
     const setTodos = s.todoPortion.todos[2];

     const state = [
         {id:1,message:'first todo'},
         {id:2,message:'second todo'}
     ]

     const action = {
        type:'SET_TODOS',
        todos:[{id:1,message:'first todo modified'}]
     }

     const newState = setTodos(state,action);
     assert(Array.isArray(newState));
     console.log(newState)
     assert(newState.length == 1);
     //assert(false, newState === state);
    // const message = newState[0];
    // assert(true,message.id === 1);
    // assert(true,message.message == 'first todo modified');
}

testAddTodo();
testArrSet();
testSetTodos();
console.log('Succesfully ran tests')
*/




