// @flow
import { createSelector } from 'reselect';
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import { loaderSelector } from './modules/loading';

const update = comment =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(comment);
    }, 1000)
  );

export type Comment = {
  id: number,
  user: number,
  text: string,
  movie: number,
};

type CommentMap = { [number]: Comment };
type FetchAction = {
  type: 'FETCH_COMMENTS',
};

type FetchSuccessAction = {
  type: 'FETCH_COMMENTS_SUCCESS',
  payload: number[],
  meta: {
    entities: { comments: CommentMap },
  },
};

type FetchErrorAction = {
  type: 'FETCH_COMMENTS_ERROR',
  payload: Error,
  error: boolean,
};

type UpdateAction = {
  type: 'UPDATE_COMMENT',
  payload: {
    id: number,
    comment: string,
  },
};

type UpdateSuccessAction = {
  type: 'UPDATE_COMMENT_SUCCESS',
  payload: number[],
  meta: {
    entities: { comments: CommentMap },
  },
};

type UpdateErrorAction = {
  type: 'UPDATE_COMMENT_ERROR',
  payload: Error,
  error: boolean,
};

type Action =
  | FetchAction
  | FetchSuccessAction
  | FetchErrorAction
  | UpdateAction
  | UpdateErrorAction
  | UpdateSuccessAction;

const fetchCommentsActionCreator = (): FetchAction => ({
  type: 'FETCH_COMMENTS',
});

const fetchCommentsSuccess = (normalizedResults: any): FetchSuccessAction => ({
  type: 'FETCH_COMMENTS_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
  },
});

const fetchCommentsError = (error: Error): FetchErrorAction => ({
  type: 'FETCH_COMMENTS_ERROR',
  payload: error,
  error: true,
});

const UPDATE_COMMENT_LOADER_NAME = 'updateComment';
const updateCommentActionCreator = (id: number, comment: string): UpdateAction => ({
  type: 'UPDATE_COMMENT',
  payload: { id, comment },
  meta: {
    triggerLoader: UPDATE_COMMENT_LOADER_NAME,
  },
});

const updateCommentSuccess = (normalizedResults: any): UpdateSuccessAction => ({
  type: 'UPDATE_COMMENT_SUCCESS',
  payload: normalizedResults.result,
  meta: {
    entities: normalizedResults.entities,
    stopLoader: UPDATE_COMMENT_LOADER_NAME,
  },
});

const updateCommentError = (error: Error): UpdateErrorAction => ({
  type: 'UPDATE_COMMENT_ERROR',
  payload: error,
  meta: {
    stopLoader: UPDATE_COMMENT_LOADER_NAME,
  },
  error: true,
});

const commentSchema = new schema.Entity('comments');
const commentsSchema = new schema.Array(commentSchema);

export function updateComment(id: number, text: string) {
  return async (dispatch: Action => any, getState: () => GlobalState): Promise<Comment> => {
    dispatch(updateCommentActionCreator(id, text));
    try {
      const comment = commentByIdSelector(getState(), id);
      const response = await update({
        ...comment,
        text,
      });

      const normalizedComments = normalize(response, commentSchema);
      dispatch(updateCommentSuccess(normalizedComments));
      return response;
    } catch (e) {
      dispatch(updateCommentError(e));
      throw e;
    }
  };
}

export function fetchComments() {
  return async (dispatch: Action => any, getState: () => GlobalState): Promise<void> => {
    dispatch(fetchCommentsActionCreator());
    try {
      const response = await axios('http://localhost:3000/users/1/comments');
      const normalizedComments = normalize(response.data, commentsSchema);
      dispatch(fetchCommentsSuccess(normalizedComments));
    } catch (e) {
      dispatch(fetchCommentsError(e));
    }
  };
}

// REDUCER

type State = $ReadOnly<{
  entities: CommentMap,
  list: number[],
  isListLoading: boolean,
  listError: ?Error,
  updateError: ?Error,
}>;

const initialState: State = {
  entities: {},
  list: [],
  isListLoading: false,
  listError: null,
  updateError: null,
};

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'FETCH_COMMENTS':
      return {
        ...state,
        isListLoading: true,
        listError: null,
      };
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.comments,
        },
        list: action.payload,
        isListLoading: false,
        listError: null,
      };
    case 'FETCH_COMMENTS_ERROR':
      return {
        ...state,
        isListLoading: false,
        listError: action.payload,
      };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        updateError: null,
      };
    case 'UPDATE_COMMENT_SUCCESS':
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.meta.entities.comments,
        },
        updateError: null,
      };
    case 'UPDATE_COMMENT_ERROR':
      return {
        ...state,
        updateError: action.payload,
      };

    default:
      return state;
  }
}

// SELECTORS

export const MODULE_KEY: 'comments' = 'comments';
type GlobalState = { [typeof MODULE_KEY]: State };

const commentMapSelector = (state: GlobalState): CommentMap => state[MODULE_KEY].entities;
const commentIdsSelector = (state: GlobalState): number[] => state[MODULE_KEY].list;
const commentByIdSelector = (state: GlobalState, id: number): ?Comment =>
  state[MODULE_KEY].entities[id];

export const commentsSelector = createSelector(
  [commentMapSelector, commentIdsSelector],
  (entities: CommentMap, ids: number[]) => {
    return ids.map(id => entities[id]);
  }
);
export const updateIsLoadingSelector = (state: GlobalState): boolean =>
  !!loaderSelector(state, UPDATE_COMMENT_LOADER_NAME);
