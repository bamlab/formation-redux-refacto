// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { put, all, takeEvery, call } from 'redux-saga/effects';

export type Movie = {
  vote_count: number,
  id: number,
  video: boolean,
  vote_average: number,
  title: string,
  popularity: number,
  poster_path: string,
  original_language: string,
  original_title: string,
  genre_ids: number[],
  backdrop_path: string,
  adult: false,
  overview: string,
  release_date: string,
};

type MovieMap = { [number]: Movie };

type FetchAction = {
  type: 'FETCH_MOVIES',
};

type FetchSuccessAction = {
  type: 'FETCH_MOVIES_SUCCESS',
  payload: number[],
  meta: {
    entities: { movies: MovieMap },
  },
};

type FetchErrorAction = {
  type: 'FETCH_MOVIES_ERROR',
  payload: Error,
  error: boolean,
};

type Action = FetchAction | FetchSuccessAction | FetchErrorAction;

export const fetchMovies = (): FetchAction => ({
  type: 'FETCH_MOVIES',
});

const fetchMoviesSuccess = (normalizedResults: any): FetchSuccessAction => ({
  type: 'FETCH_MOVIES_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
  },
});

const fetchMoviesError = (error: Error): FetchErrorAction => ({
  type: 'FETCH_MOVIES_ERROR',
  payload: error,
  error: true,
});

// REDUCER

type State = $ReadOnly<{
  entities: MovieMap,
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
    case 'FETCH_MOVIES':
      return {
        ...state,
        isListLoading: true,
        listError: null,
      };
    case 'FETCH_MOVIES_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.movies,
        },
        list: action.payload,
        isListLoading: false,
        listError: null,
      };
    case 'FETCH_MOVIES_ERROR':
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

export const MODULE_KEY: 'movies' = 'movies';
type GlobalState = { [typeof MODULE_KEY]: State };

const movieMapSelector = (state: GlobalState, id: number): MovieMap => state[MODULE_KEY].entities;

const movieIdsSelector = (state: GlobalState, id: number): number[] => state[MODULE_KEY].list;

export const moviesSelector = createSelector(
  [movieMapSelector, movieIdsSelector],
  (entities: MovieMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

// SAGAS

const moviesSchema = new schema.Array(new schema.Entity('movies'));

function* fetchMoviesSaga(): Generator<*, *, *> {
  console.log('call');
  try {
    const response = yield call(axios, 'http://localhost:3000/movies');
    const normalizedMovies = normalize(response.data, moviesSchema);
    yield put(fetchMoviesSuccess(normalizedMovies));
  } catch (e) {
    yield put(fetchMoviesError(e));
  }
}

export function* saga(): Generator<*, *, *> {
  console.log('movies saga');
  yield all([takeEvery('FETCH_MOVIES', fetchMoviesSaga)]);
}
