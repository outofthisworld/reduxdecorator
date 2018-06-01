const simple_reducer = (key, callback) => {
    return function (state, action = {}) {
        switch (action.type) {
            case key:
                state = callback(state, action)
        }
        return state;
    }
}

module.exports = simple_reducer;