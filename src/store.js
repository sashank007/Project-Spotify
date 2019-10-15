import {
  tracksReducer,
  searchQueryReducer
} from "./Reducers/AllTracksReducers";

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
  tracksReducer,
  searchQueryReducer
});

const store = createStore(rootReducer);

window.store = store;
export default store;
