const default_state = require('./default_state');
const simple_reducer = require('./simple_reducer')
const array_reducers = require('./array');
const boolean_reducers = require('./boolean');
const number_reducers = require('./number');

module.exports = Object.assign({},
    array_reducers,
    boolean_reducers,
    number_reducers,
    {
        default_state,
        simple_reducer
    }
);