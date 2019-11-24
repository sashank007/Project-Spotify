import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const displayCurrentTrack = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.DISPLAY_CURRENT_TRACK, payload: payload });
};

export const setCurrentTrackDuration = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.SET_TRACK_DURATION, payload: payload });
};
