import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const currentTrackReducer = (
  state = {
    showCurrentTrack: false,
    currentTrackDuration: 100000
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.DISPLAY_CURRENT_TRACK: {
      return { ...state, showCurrentTrack: payload };
    }

    case ACTION_TYPES.SET_TRACK_DURATION: {
      return { ...state, currentTrackDuration: payload };
    }

    default: {
    }
  }
  return state;
};
