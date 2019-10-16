import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const queueTrack = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.QUEUE_TRACK, payload: payload });
};

export const updateCurrentTrack = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.UPDATE_CURRENT_TRACK, payload: payload });
};
