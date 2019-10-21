import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const displayCurrentTrack = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.DISPLAY_CURRENT_TRACK, payload: payload });
};
