import {
  tracksReducer,
  searchQueryReducer
} from "./Reducers/AllTracksReducers";
import {
  queueTrackReducer,
  currentTrackReducer,
  displayCurrentTrackReducer
} from "./Reducers/QueueReducer";
import { sessionReducer, privateIdReducer } from "./Reducers/SessionReducers";
import { allUsersReducer } from "./Reducers/UsersReducers";

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  tracksReducer,
  searchQueryReducer,
  queueTrackReducer,
  currentTrackReducer,
  sessionReducer,
  privateIdReducer,
  displayCurrentTrackReducer,
  allUsersReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
