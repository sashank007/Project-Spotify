import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const queueTrackReducer = (
  state = {
    queue: []
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.QUEUE_TRACK: {
      return { ...state, queue: payload };
    }
    default: {
    }
  }
  return state;
};

export const displayCurrentTrackReducer = (
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

export const currentTrackReducer = (
  state = {
    trackName: "",
    trackImage: "",
    trackDuration: 0
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.UPDATE_CURRENT_TRACK: {
      console.log("payload  in now:", payload);
      let { trackName, trackImage, trackDuration } = payload;
      return { ...state, trackName, trackDuration, trackImage };
    }
    default: {
    }
  }
  return state;
};
