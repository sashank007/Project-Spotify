import * as ACTION_TYPES from "../ActionTypes/ActionTypes";

export const setAllUsers = (dispatch = null, payload = null) => {
  dispatch({ type: ACTION_TYPES.GET_ALL_USERS, payload: payload });
};
