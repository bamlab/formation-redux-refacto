// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { put, all, takeEvery, call } from 'redux-saga/effects';
import type { Comment } from './Comments';

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
  comments: Comment[],
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

type FetchFavoritesAction = {
  type: 'FETCH_FAVORITES',
};

type FetchFavoritesSuccessAction = {
  type: 'FETCH_FAVORITES_SUCCESS',
  payload: number[],
  meta: {
    entities: { movies: MovieMap },
  },
};

type FetchFavoritesErrorAction = {
  type: 'FETCH_FAVORITES_ERROR',
  payload: Error,
  error: boolean,
};

type Action =
  | FetchAction
  | FetchSuccessAction
  | FetchErrorAction
  | FetchFavoritesAction
  | FetchFavoritesSuccessAction
  | FetchFavoritesErrorAction;

const fetchMoviesActionCreator = (): FetchAction => ({
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

const fetchFavoritesActionCreator = (): FetchFavoritesAction => ({
  type: 'FETCH_FAVORITES',
});

const fetchFavoritesSuccess = (normalizedResults: any): FetchFavoritesSuccessAction => ({
  type: 'FETCH_FAVORITES_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
  },
});

const fetchFavoritesError = (error: Error): FetchFavoritesErrorAction => ({
  type: 'FETCH_FAVORITES_ERROR',
  payload: error,
  error: true,
});

const moviesSchema = new schema.Array(new schema.Entity('movies'));

export function fetchMovies() {
  return async (dispatch: Action => any, getState: () => GlobalState): Promise<Movie[]> => {
    dispatch(fetchMoviesActionCreator());
    try {
      const response = await axios('http://localhost:3000/movies');
      const normalizedMovies = normalize(response.data, moviesSchema);
      dispatch(fetchMoviesSuccess(normalizedMovies));
      return response.data;
    } catch (e) {
      dispatch(fetchMoviesError(e));
      throw e;
    }
  };
}
export function fetchFavorites() {
  return async (dispatch: Action => any, getState: () => GlobalState): Promise<Movie[]> => {
    dispatch(fetchFavoritesActionCreator());
    try {
      const response = await axios('http://localhost:3000/users/1/favorites');
      const normalizedMovies = normalize(response.data, moviesSchema);
      dispatch(fetchFavoritesSuccess(normalizedMovies));
      return response.data;
    } catch (e) {
      dispatch(fetchFavoritesError(e));
      throw e;
    }
  };
}

// REDUCER

type State = $ReadOnly<{
  entities: MovieMap,
  list: number[],
  isListLoading: boolean,
  listError: ?Error,
  favorites: number[],
  isFavLoading: boolean,
  listFavError: ?Error,
}>;

const initialState: State = {
  entities: {},
  list: [],
  isListLoading: false,
  listError: null,
  favorites: [],
  isFavLoading: false,
  listFavError: null,
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
    case 'FETCH_FAVORITES':
      return {
        ...state,
        isFavLoading: true,
        listFavError: null,
      };
    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.movies,
        },
        favorites: action.payload,
        isFavLoading: false,
        listFavError: null,
      };
    case 'FETCH_FAVORITES_ERROR':
      return {
        ...state,
        isFavLoading: false,
        listFavError: action.payload,
      };
    default:
      return state;
  }
}

// SELECTORS

export const MODULE_KEY: 'movies' = 'movies';
type GlobalState = { [typeof MODULE_KEY]: State };

const movieMapSelector = (state: GlobalState): MovieMap => state[MODULE_KEY].entities;
const movieIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;
const favoritesIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].favorites;
export const movieByIdSelector = (state: GlobalState, id: number): ?Movie =>
  state[MODULE_KEY].entities[id];

export const moviesSelector = createSelector(
  [movieMapSelector, movieIdsSelector],
  (entities: MovieMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

export const favoritesSelector = createSelector(
  [movieMapSelector, favoritesIdsSelector],
  (entities: MovieMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);

export const isFavoriteSelector = (state: GlobalState, id: number): boolean =>
  favoritesIdsSelector(state).includes(id);
