import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const setTracks = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.SEARCH_TRACKS, payload: payload });
};

export const searchQuery = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.SEARCH_QUERY, payload: payload });
};
