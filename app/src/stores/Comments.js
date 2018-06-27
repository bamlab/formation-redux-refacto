// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { put, all, takeEvery, call } from 'redux-saga/effects';

export type Comment = {
  id: number,
  user: number,
  text: string,
  movie: number,
};

type CommentMap = { [number]: Comment };

type FetchAction = {
  type: 'FETCH_COMMENTS',
};

type FetchSuccessAction = {
  type: 'FETCH_COMMENTS_SUCCESS',
  payload: number[],
  meta: {
    entities: { comments: CommentMap },
  },
};

type FetchErrorAction = {
  type: 'FETCH_COMMENTS_ERROR',
  payload: Error,
  error: boolean,
};

type Action = FetchAction | FetchSuccessAction | FetchErrorAction;

export const fetchComments = (): FetchAction => ({
  type: 'FETCH_COMMENTS',
});

const fetchCommentsSuccess = (normalizedResults: any): FetchSuccessAction => ({
  type: 'FETCH_COMMENTS_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
  },
});

const fetchCommentsError = (error: Error): FetchErrorAction => ({
  type: 'FETCH_COMMENTS_ERROR',
  payload: error,
  error: true,
});

// REDUCER

type State = $ReadOnly<{
  entities: CommentMap,
  list: number[],
  isListLoading: boolean,
  listError: ?Error,
}>;

const initialState: State = {
  entities: {},
  list: [],
  isListLoading: false,
  listError: null,
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'FETCH_COMMENTS':
      return {
        ...state,
        isListLoading: true,
        listError: null,
      };
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.comments,
        },
        list: action.payload,
        isListLoading: false,
        listError: null,
      };
    case 'FETCH_COMMENTS_ERROR':
      return {
        ...state,
        isListLoading: false,
        listError: action.payload,
      };
    default:
      return state;
  }
}

// SELECTORS

export const MODULE_KEY: 'comments' = 'comments';
type GlobalState = { [typeof MODULE_KEY]: State };

const commentMapSelector = (state: GlobalState): CommentMap => state[MODULE_KEY].entities;
const commentIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;

export const commentsSelector = createSelector(
  [commentMapSelector, commentIdsSelector],
  (entities: CommentMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

// SAGAS

const commentsSchema = new schema.Array(new schema.Entity('comments'));

function* fetchCommentsSaga(): Generator<*, *, *> {
  try {
    const response = yield call(axios, 'http://localhost:3000/users/1/comments');
    const normalizedComments = normalize(response.data, commentsSchema);
    yield put(fetchCommentsSuccess(normalizedComments));
  } catch (e) {
    yield put(fetchCommentsError(e));
  }
}

export function* saga(): Generator<*, *, *> {
  yield all([takeEvery('FETCH_COMMENTS', fetchCommentsSaga)]);
}
