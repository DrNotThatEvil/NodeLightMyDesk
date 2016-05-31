export default function server(state = [], action) {
    switch (action.type) {
    case 'SET_INSTALLED':
        return Object.assign({}, state, {
            installed: action.value
        });
    case 'SET_CHIPTYPE':
        return Object.assign({}, state, {
            chiptype: action.value
        });
    case 'SET_SPIDEVTYPE':
        return Object.assign({}, state, {
            spidevtype: action.value
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
