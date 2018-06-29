// @flow
import { combineReducers } from 'redux';

import { default as loaderReducer, MODULE_KEY as LOADER_MODULE_KEY } from './modules/loading';
import { default as movieReducer, MODULE_KEY as MOVIE_MODULE_KEY } from './Movies';
import { default as commentsReducer, MODULE_KEY as COMMENTS_MODULE_KEY } from './Comments';
import { default as usersReducer, MODULE_KEY as USERS_MODULE_KEY } from './Users';
import { default as entitiesReducer, MODULE_KEY as ENTITIES_MODULE_KEY } from './modules/entities';

export default combineReducers({
  [LOADER_MODULE_KEY]: loaderReducer,
  [MOVIE_MODULE_KEY]: movieReducer,
  [COMMENTS_MODULE_KEY]: commentsReducer,
  [USERS_MODULE_KEY]: usersReducer,
  [ENTITIES_MODULE_KEY]: entitiesReducer,
});
