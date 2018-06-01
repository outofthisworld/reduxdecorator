const combine = require('./utils/combine');
const reducers = require('./reducers');

const final = Object.assign({},reducers,{
    create_reducer:(tree) => (prevState = {}, action) => {
        const isObject = (obj) => obj === Object(obj) 
        && Object.prototype.toString.call(obj) !== '[object Array]';

        if(!tree || !isObject(tree)){
            throw new Error('Invalid tree');
        }
        for (key in tree) {
            const val = tree[key];
            if (isObject(val)) {
                prevState[key] = prevState[key] || {};
                create_reducer(val)(prevState[key],action);
            } else if(Array.isArray(val)) {
                const reducer = combine.apply(null, val);
                prevState[key] = reducer(prevState[key], action);
            }else{
                prevState[key] = val;
            }
        }
        return prevState;
    },
    combine
});


module.exports = final;

