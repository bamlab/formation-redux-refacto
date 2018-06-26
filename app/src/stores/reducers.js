// @flow
import { combineReducers } from 'redux';

import { default as movieReducer, MODULE_KEY as MOVIE_MODULE_KEY } from './Movies';

export default combineReducers({
  [MOVIE_MODULE_KEY]: movieReducer,
});
