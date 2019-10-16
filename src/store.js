import {
  tracksReducer,
  searchQueryReducer
} from "./Reducers/AllTracksReducers";
import {
  queueTrackReducer,
  currentTrackReducer
} from "./Reducers/QueueReducer";

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  tracksReducer,
  searchQueryReducer,
  queueTrackReducer,
  currentTrackReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
