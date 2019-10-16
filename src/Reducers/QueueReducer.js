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
