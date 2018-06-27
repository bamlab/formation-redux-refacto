// @flow
import { combineReducers } from 'redux';

import { default as movieReducer, MODULE_KEY as MOVIE_MODULE_KEY } from './Movies';
import { default as commentsReducer, MODULE_KEY as COMMENTS_MODULE_KEY } from './Comments';
import { default as usersReducer, MODULE_KEY as USERS_MODULE_KEY } from './Users';

export default combineReducers({
  [MOVIE_MODULE_KEY]: movieReducer,
  [COMMENTS_MODULE_KEY]: commentsReducer,
  [USERS_MODULE_KEY]: usersReducer,
});
