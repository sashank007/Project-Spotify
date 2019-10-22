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

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  tracksReducer,
  searchQueryReducer,
  queueTrackReducer,
  currentTrackReducer,
  sessionReducer,
  privateIdReducer,
  displayCurrentTrackReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
