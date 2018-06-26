// @flow
import { all, call } from 'redux-saga/effects';
import { saga as moviesSaga } from './Movies';

export default function*(): Generator<*, *, *> {
  console.log('root saga');
  yield all([call(moviesSaga)]);
}
