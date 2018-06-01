const simple_reducer = require('../simple_reducer');

module.exports = boolean_set = (key) => (func) => simple_reducer(key,func);