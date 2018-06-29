// @flow
import { merge } from 'lodash';

type Action = {
  meta?: {
    entities?: {
      [entityName: string]: {
        [number]: Object,
      },
    },
  },
};

type State = {
  [entityName: string]: {
    [number]: Object,
  },
};

const initialState = {};

export default function reducer(state: State = initialState, action: Action): State {
  if (action.meta && action.meta.entities) {
    return merge({}, state, action.meta.entities);
  }
  return state;
}

export const MODULE_KEY: 'entities' = 'entities';
type GlobalState = { [typeof MODULE_KEY]: State };

export const allEntitiesSelector = (state: GlobalState): State => state[MODULE_KEY];
export const entitiesSelector = (state: GlobalState, name: string): { [number]: Object } =>
  allEntitiesSelector(state)[name] || {};
