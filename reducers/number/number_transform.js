const simple_reducer = require('../simple_reducer');

module.exports = number_transform = (key) => (func) => simple_reducer(key, (state, action) => func(state, action));