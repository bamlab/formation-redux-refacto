// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { schema, denormalize } from 'normalizr';
import type { Comment } from './Comments';
import { entitiesSelector, allEntitiesSelector } from './modules/entities';
import { commentsSchema } from './Comments';
import { createFetchListThunk } from './modules/fetch';

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

type FetchSuccessAction = {
  type: 'FETCH_MOVIES_SUCCESS',
  payload: number[],
};

type FetchFavoritesSuccessAction = {
  type: 'FETCH_FAVORITES_SUCCESS',
  payload: number[],
};

type Action = FetchSuccessAction | FetchFavoritesSuccessAction;

const FETCH_MOVIES = 'FETCH_MOVIES';
const FETCH_FAVORITES = 'FETCH_FAVORITES';

const moviesSchema = new schema.Array(
  new schema.Entity('movies', {
    comments: commentsSchema,
  })
);

const fetchMoviesFunction = () => axios('http://localhost:3000/movies');
export const fetchMovies = createFetchListThunk(
  fetchMoviesFunction,
  FETCH_MOVIES,
  moviesSchema,
  'FETCH_MOVIES',
  'FETCH_MOVIES_SUCCESS'
);

const fetchFavoritesFunction = () => axios('http://localhost:3000/users/1/favorites');
export const fetchFavorites = createFetchListThunk(
  fetchFavoritesFunction,
  FETCH_FAVORITES,
  moviesSchema,
  'FETCH_FAVORITES',
  'FETCH_FAVORITES_SUCCESS'
);

// REDUCER

type State = $ReadOnly<{
  list: number[],
  favorites: number[],
}>;

const initialState: State = {
  list: [],
  favorites: [],
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'FETCH_MOVIES_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        favorites: action.payload,
      };
    default:
      return state;
  }
}

// SELECTORS

export const MODULE_KEY: 'movies' = 'movies';
type GlobalState = { [typeof MODULE_KEY]: State };

const movieMapSelector = (state: GlobalState): MovieMap => entitiesSelector(state, 'movies');
const movieIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;
const favoritesIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].favorites;
export const movieByIdSelector = (state: GlobalState, id: number): ?Movie =>
  movieMapSelector(state)[id];

export const moviesSelector = createSelector(
  [allEntitiesSelector, movieIdsSelector],
  (entities, ids: number[]) => {
    return denormalize(ids, moviesSchema, entities);
  }
);

export const favoritesSelector = createSelector(
  [allEntitiesSelector, favoritesIdsSelector],
  (entities, ids: number[]) => {
    return denormalize(ids, moviesSchema, entities);
  }
);

export const isFavoriteSelector = (state: GlobalState, id: number): boolean =>
  favoritesIdsSelector(state).includes(id);
