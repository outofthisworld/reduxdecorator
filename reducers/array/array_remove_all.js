const simple_reducer = require('../simple_reducer');

module.exports = array_remove_all = (key) => simple_reducer(key, () => []);