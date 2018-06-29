// @flow

type Action =
  | {
      payload: any,
      meta?: {
        saveError?: string,
        removeError?: string,
      },
    }
  | {
      payload: Error,
      meta?: {
        saveError?: string,
        removeError?: string,
      },
      error: true,
    };

type State = {
  [string]: Error,
};

const initialState = {};

export default function reducer(state: State = initialState, action: Action): State {
  if (!action.meta) {
    return state;
  }
  if (action.meta.saveError && action.error) {
    return {
      ...state,
      [action.meta.saveError]: action.payload,
    };
  }
  if (action.meta.removeError) {
    return {
      ...state,
      [action.meta.removeError]: null,
    };
  }
  return state;
}

export const MODULE_KEY: 'error' = 'error';
type GlobalState = { [typeof MODULE_KEY]: State };

export const errorSelector = (state: GlobalState, error: string): ?Error =>
  state[MODULE_KEY][error];
