import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const queueTrack = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.QUEUE_TRACK, payload: payload });
};
