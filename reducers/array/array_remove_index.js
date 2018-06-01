const simple_reducer = require('../simple_reducer');

module.exports = array_remove_index = (key) => (index) => simple_reducer(key, (state, action) => {
        const copy = [...state];
        const ind = index(state, action);
    
        if(!Number.isInteger(ind) || ind < 0 || ind>=copy.length){
            throw new Error('Redux_utils error: invalid index returned');
        }
        copy.splice(ind,1);
        return copy;
});