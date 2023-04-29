import { combineReducers } from "redux";
import markerReducer from "./reducer";

const reducers = combineReducers({
    markers: markerReducer
    // if there is other reducers, put here...
});

export default reducers;