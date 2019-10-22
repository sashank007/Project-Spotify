import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const allUsersReducer = (
  state = {
    playingUsers: []
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.GET_ALL_USERS: {
      return { ...state, playingUsers: payload };
    }
    default: {
    }
  }
  return state;
};
