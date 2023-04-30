import { ActionTypes } from "../constant/constants";

const initialState = {
  locations: [],
  polygons: [],
  filters: {
    status: 'All',
  }
}

// Use the initialState as a default value
export function markerReducer(state = initialState, action) {
  const { type, payload } = action
  // The reducer normally looks at the action type field to decide what happens
  switch (type) {
    // Do something here based on the different types of actions
    case ActionTypes.ADD_MARKER:
      return {...state, locations: [...state.locations, payload]};
    case ActionTypes.SET_LOCATIONS:
      return {...state, locations: payload};
    case ActionTypes.DELETE_MARKER:
      const updatedLocations = state.locations.filter(location => location.id !== payload);
      return { ...state, locations: updatedLocations }; 
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state
  }
}


export function polygonReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case ActionTypes.ADD_POLYGONS:
      return {...state, polygons: [...state.polygons, payload]};
    case ActionTypes.SET_POLYGONS: 
      return {...state, polygons: payload};
    case ActionTypes.DELETE_POLYGON:
      const updatedPolygons = state.polygons.filter(polygon => polygon.id !== payload);
      return { ...state, polygons: updatedPolygons };
    default:
      return state
  }
}