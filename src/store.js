import {
  tracksReducer,
  searchQueryReducer
} from "./Reducers/AllTracksReducers";
import {
  queueTrackReducer,
  currentTrackReducer,
  displayCurrentTrackReducer,
  masterReducer
} from "./Reducers/QueueReducer";
import {
  sessionReducer,
  privateIdReducer,
  socketReducer
} from "./Reducers/SessionReducers";
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
  allUsersReducer,
  masterReducer,
  socketReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
