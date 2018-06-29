// @flow

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
  type: 'FETCH',
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
