// @flow
import { normalize } from 'normalizr';

export type FetchAction = {
  type: string,
  meta: {
    triggerLoader: string,
    removeError: string,
  },
};

export type FetchSuccessAction = {
  type: string,
  payload: number[],
  meta: {
    entities: { [string]: { [number]: Object } },
    stopLoader: string,
  },
};

type FetchErrorAction = {
  type: string,
  payload: Error,
  error: boolean,
  meta: {
    stopLoader: string,
    saveError: string,
  },
};

export const fetchActionCreator = (query: string, type: string = 'FETCH_SUCCESS'): FetchAction => ({
  type,
  meta: {
    triggerLoader: query,
    removeError: query,
  },
});

export const fetchSuccessActionCreator = (
  normalizedResults: any,
  query: string,
  type: string = 'FETCH_SUCCESS'
): FetchSuccessAction => ({
  type,
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
    stopLoader: query,
  },
});

export const fetchErrorActionCreator = (
  error: Error,
  query: string,
  type: string = 'FETCH_ERROR'
): FetchErrorAction => ({
  type,
  payload: error,
  error: true,
  meta: {
    stopLoader: query,
    saveError: query,
  },
});

export function createFetchListThunk(
  fetchFunction: Function,
  query: string,
  schema: any,
  fetchType: string = 'FETCH',
  fetchSuccessType: string = 'FETCH_SUCCESS',
  fetchErrorType: string = 'FETCH_ERROR'
) {
  return function() {
    return async (dispatch: Object => any): Promise<*> => {
      dispatch(fetchActionCreator(query, fetchType));
      try {
        const response = await fetchFunction();
        const normalizeEntities = normalize(response.data, schema);
        dispatch(fetchSuccessActionCreator(normalizeEntities, query, fetchSuccessType));
        return response.data;
      } catch (e) {
        dispatch(fetchErrorActionCreator(e, query, fetchErrorType));
        throw e;
      }
    };
  };
}
