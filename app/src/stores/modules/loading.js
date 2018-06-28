// @flow

type Action = {
  meta?: {
    triggerLoader?: string,
    stopLoader?: string,
  },
};

type State = {
  [string]: boolean,
};

const initialState = {};

export default function reducer(state: State = initialState, action: Action): State {
  if (!action.meta) {
    return state;
  }
  if (action.meta.triggerLoader) {
    return {
      ...state,
      [action.meta.triggerLoader]: true,
    };
  }
  if (action.meta.stopLoader) {
    return {
      ...state,
      [action.meta.stopLoader]: false,
    };
  }
  return state;
}

export const MODULE_KEY: 'loader' = 'loader';
type GlobalState = { [typeof MODULE_KEY]: State };

export const loaderSelector = (state: GlobalState, loaderName: string): ?boolean =>
  state[MODULE_KEY][loaderName];
