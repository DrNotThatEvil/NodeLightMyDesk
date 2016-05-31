import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

let finalCreateStore = compose(
    applyMiddleware(thunk, logger())
)(createStore);

export default function configureStore(initialState = { server: { installed: false, ledlength: 1, errors: [] } })
{
    return finalCreateStore(reducer, initialState);
}
