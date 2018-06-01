const simple_reducer = require('../simple_reducer');

module.exports = array_append = (key) => (obj) =>
    simple_reducer(key,(state, action) => [...state, obj(state, action)]);