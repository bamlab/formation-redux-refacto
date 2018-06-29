// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { put, all, takeEvery, call } from 'redux-saga/effects';
import { entitiesSelector } from './modules/entities';

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

const FETCH_USERS = 'FETCH_USERS';

const fetchUsersActionCreator = (): FetchAction => ({
  type: 'FETCH_USERS',
  meta: {
    triggerLoader: FETCH_USERS,
  },
});

const fetchUsersSuccess = (normalizedResults: any): FetchSuccessAction => ({
  type: 'FETCH_USERS_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
    stopLoader: FETCH_USERS,
  },
});

const fetchUsersError = (error: Error): FetchErrorAction => ({
  type: 'FETCH_USERS_ERROR',
  payload: error,
  error: true,
  meta: {
    stopLoader: FETCH_USERS,
  },
});

const usersSchema = new schema.Array(new schema.Entity('users'));

export function fetchUsers() {
  return async (dispatch: Action => any, getState: () => GlobalState): Promise<User[]> => {
    dispatch(fetchUsersActionCreator());
    try {
      const response = await axios('http://localhost:3000/users');
      const normalizedUsers = normalize(response.data, usersSchema);
      dispatch(fetchUsersSuccess(normalizedUsers));
      return response.data;
    } catch (e) {
      dispatch(fetchUsersError(e));
      throw e;
    }
  };
}

// REDUCER

type State = $ReadOnly<{
  list: number[],
}>;

const initialState: State = {
  list: [],
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
}

// SELECTORS

export const MODULE_KEY: 'users' = 'users';
type GlobalState = { [typeof MODULE_KEY]: State };

const userMapSelector = (state: GlobalState): CommentMap => entitiesSelector(state, 'users');
const userIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;
export const userByIdSelector = (state: GlobalState, id: number): ?User =>
  userMapSelector(state)[id];

export const usersSelector = createSelector(
  [userMapSelector, userIdsSelector],
  (entities: UserMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

// SAGAS
