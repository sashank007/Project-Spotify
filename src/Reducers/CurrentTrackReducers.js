import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const currentTrackReducer = (
  state = {
    showCurrentTrack: false
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.DISPLAY_CURRENT_TRACK: {
      return { ...state, showCurrentTrack: payload };
    }
    default: {
    }
  }
  return state;
};
