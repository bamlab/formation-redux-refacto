// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { put, all, takeEvery, call } from 'redux-saga/effects';

export type User = {
  id: number,
  firstname: string,
  lastname: string,
  email: string,
};

type UserMap = { [number]: User };

type FetchAction = {
  type: 'FETCH_USERS',
};

type FetchSuccessAction = {
  type: 'FETCH_USERS_SUCCESS',
  payload: number[],
  meta: {
    entities: { users: UserMap },
  },
};

type FetchErrorAction = {
  type: 'FETCH_USERS_ERROR',
  payload: Error,
  error: boolean,
};

type Action = FetchAction | FetchSuccessAction | FetchErrorAction;

export const fetchUsers = (): FetchAction => ({
  type: 'FETCH_USERS',
});

const fetchUsersSuccess = (normalizedResults: any): FetchSuccessAction => ({
  type: 'FETCH_USERS_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
  },
});

const fetchUsersError = (error: Error): FetchErrorAction => ({
  type: 'FETCH_USERS_ERROR',
  payload: error,
  error: true,
});

// REDUCER

type State = $ReadOnly<{
  entities: UserMap,
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
    case 'FETCH_USERS':
      return {
        ...state,
        isListLoading: true,
        listError: null,
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.users,
        },
        list: action.payload,
        isListLoading: false,
        listError: null,
      };
    case 'FETCH_USERS_ERROR':
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

export const MODULE_KEY: 'users' = 'users';
type GlobalState = { [typeof MODULE_KEY]: State };

const userMapSelector = (state: GlobalState): UserMap => state[MODULE_KEY].entities;
const userIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;
export const userByIdSelector = (state: GlobalState, id: number): ?User =>
  state[MODULE_KEY].entities[id];

export const usersSelector = createSelector(
  [userMapSelector, userIdsSelector],
  (entities: UserMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

// SAGAS

const usersSchema = new schema.Array(new schema.Entity('users'));

function* fetchUsersSaga(): Generator<*, *, *> {
  try {
    const response = yield call(axios, 'http://localhost:3000/users');
    const normalizedUsers = normalize(response.data, usersSchema);
    yield put(fetchUsersSuccess(normalizedUsers));
  } catch (e) {
    yield put(fetchUsersError(e));
  }
}

export function* saga(): Generator<*, *, *> {
  yield all([takeEvery('FETCH_USERS', fetchUsersSaga)]);
}
