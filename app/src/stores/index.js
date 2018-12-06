// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const middlewares = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function createReduxStore() {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
  return store;
}
