import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const setSessionToken = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.SET_ACCESS_TOKEN, payload: payload });
};
