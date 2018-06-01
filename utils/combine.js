module.exports = function combine(...funcs) {
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