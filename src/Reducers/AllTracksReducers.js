import * as ACTION_TYPES from "../ActionTypes/ActionTypes";
import { searchTracks } from "../Middleware/searchMiddleWare";

export const tracksReducer = (
  state = {
    tracks: []
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.SEARCH_TRACKS: {
      return { ...state, tracks: payload };
    }
    default: {
    }
  }
  return state;
};

export const searchQueryReducer = (
  state = {
    query: ""
  },
  { type, payload }
) => {
  switch (type) {
    case ACTION_TYPES.SEARCH_QUERY: {
      return { ...state, query: payload };
    }
    default: {
    }
  }
  return state;
};
