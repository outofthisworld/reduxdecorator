const simple_reducer = require('../simple_reducer');

module.exports = boolean_toggle = (key) => simple_reducer(key,(state,action)=>!state)