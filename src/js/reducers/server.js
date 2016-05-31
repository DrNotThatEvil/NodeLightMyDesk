export default function server(state = [], action) {
    switch (action.type) {
    case 'SET_INSTALLED':
        return Object.assign({}, state, {
            installed: action.value
        });
    case 'PUT_ERRORS':
        return Object.assign({}, state, {
            errors: [
                ...action.errors,
                ...state.errors
            ]
        });
    default:
        return state;
    }
}
