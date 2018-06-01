export default (key, callback) => {
    return function (state, action = {}) {
        switch (action.type) {
            case key:
                state = callback(state, action)
        }
        return state;
    }
}