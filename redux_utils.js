const { createStore } = require('redux');

const simple_reducer = (key, de, callback) => {
    return function (state = de, action = {}) {
        switch (action.type) {
            case key:
                state = callback(state, action)
        }
        return state;
    }
}
const array_append = (key) => (obj) =>
    simple_reducer(key, [], (state, action) => [...state, obj(state, action)]);

const array_set = (key) => (obj) =>
    simple_reducer(key, [], (state, action) => {
        const newArr = obj(state,action);
        if(!Array.isArray(newArr)){
            throw new Error('Redux_utils error: array_set must return an array');
        }
        //The user modified the original array state
        if(newArr === state){
            throw new Error('Redux_utils error: original array was returned from array_set, please make sure you copy the state.')
        }
        return newArr;
    });
   

const array_remove_index = (key) => (index) =>
    simple_reducer(key, [], (state, action) => {
        const copy = [...state];
        const index = index(state, action);
        if(!Number.isInteger(index) || index < 0 || index>=copy.length){
            throw new Error('Redux_utils error: invalid index returned');
        }
        copy.splice(index(state, action), 1);
        return copy;
    });

const array_remove_all = (key) => simple_reducer(key, [], () => []);

const number_transform = (key, de = 0) => (func) =>
    simple_reducer(key, de, (state, action) => func(state, action))


const boolean_toggle = (key, de=false) => simple_reducer(key,de,(state,action)=>!state)
const boolean_set = (key, de=false) => (func) => simple_reducer(key,de,func);


//const number_decrement = (key,de) => (val,amount) => number_increment(key,de)(val,-amount);

//const number_set

function combine(...funcs) {
    return function (state, action) {
        return funcs.reduce(function (prev, cur) {
            if (typeof cur === 'function') {
                return cur(prev, action);
            } else {
                return prev;
            }
        }, state)
    }
}

const redux_reducer = (tree) => (prevState = {}, action) => {
    const isObject = (obj) => obj === Object(obj) 
    && Object.prototype.toString.call(obj) !== '[object Array]';

    if(!tree || !isObject(tree)){
        throw new Error('Invalid tree');
    }
    for (key in tree) {
        const val = tree[key];
        if (isObject(val)) {
            redux_reducer(val)(prevState,action);
        } else if(Array.isArray(val)) {
            const reducer = combine.apply(null, val);
            prevState[key] = reducer(prevState[key], action);
        }else{
            prevState[key] = val;
        }
    }
    return prevState;
}

const s = {
    todoPortion: {
        todos: [
            //Return the new objet to add to the array
            array_append('ADD_TODO')((state, action) => ({
                    id: (state.todos && state.todos.length + 1) || 0,
                    message: action.message
            }),
            //Return the index to remove
            array_remove_index('REMOVE_TODO')((state, action)=> action.index)),
            //Return the new array to set the current array to.
            array_set('SET_TODOS')((state,action)=>[...action.todos]),
            //Sets the state to a new array automagically!
            array_remove_all('REMOVE_ALL_TODOS'),
            //Remove one item
            //array_filter('REMOVE_TODOS_MATCHING')((f)=> f.index != action.index),
            //array_map('TRANSFORM_TODOS')((f)=> ({...f,newProp:1}))
        ]
    },
    count: [
        number_transform('INCREMENT_COUNT', 0)((state, action) =>  state + action.amount),
    ],
    toggleBool: [
        //truthify('IS_ON'),
        //falsify('IS_OFF'),
        //boolean_false(),
        //boolean_true(),
        //boolean_set(),
        boolean_toggle('TOGGLE_STATE', false),
        //set_bool('SWITCH')(action.toogleBool)
    ],
    //A constant value that cannot be changed
    someVal:1
}


const store = createStore(redux_reducer(s));

store.subscribe(function() {
    console.log(' === STATE === ')
    console.log(store.getState())
    console.log(' ============= ')
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



