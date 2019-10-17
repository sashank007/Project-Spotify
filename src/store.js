import {
  tracksReducer,
  searchQueryReducer
} from "./Reducers/AllTracksReducers";
import {
  queueTrackReducer,
  currentTrackReducer
} from "./Reducers/QueueReducer";
import { sessionReducer } from "./Reducers/SessionReducers";

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  tracksReducer,
  searchQueryReducer,
  queueTrackReducer,
  currentTrackReducer,
  sessionReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
