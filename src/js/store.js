import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

let finalCreateStore = compose(
    applyMiddleware(thunk, promiseMiddleware, logger())
)(createStore);

export default function configureStore(initialState = {
    server: {
        installed: false,
        ledlength: 1,
        ledlengthlock: false,
        errors: [],
        color: [125, 0, 255],
        status: false
    }
})
{
    return finalCreateStore(reducer, initialState);
}
