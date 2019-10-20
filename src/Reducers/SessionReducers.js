import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const sessionReducer = (
  state = {
    accessToken: ""
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.SET_ACCESS_TOKEN: {
      return { ...state, accessToken: payload };
    }
    default: {
    }
  }
  return state;
};

export const privateIdReducer = (
  state = {
    privateId: ""
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.SET_PRIVATE_ID: {
      console.log("settign private id ...", payload);
      return { ...state, privateId: payload };
    }
    default: {
    }
  }
  return state;
};
