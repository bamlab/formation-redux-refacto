// @flow
import { all, call } from 'redux-saga/effects';
import { saga as moviesSaga } from './Movies';
import { saga as commentsSaga } from './Comments';
import { saga as usersSaga } from './Users';

export default function*(): Generator<*, *, *> {
  yield all([call(moviesSaga), call(commentsSaga), call(usersSaga)]);
}
