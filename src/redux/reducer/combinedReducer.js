import { combineReducers } from "redux";
import { markerReducer, polygonReducer } from "./reducer";

const reducers = combineReducers({
    markerReducer: markerReducer,
    polygonReducer: polygonReducer
    // if there is other reducers, put here...
});

export default reducers;