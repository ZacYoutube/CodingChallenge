import { ActionTypes } from "../constant/constants";

export const addMarkers = (locationObj) => {
    return {
        type: ActionTypes.ADD_MARKER,
        payload: locationObj
    }
}

export const setLocations = (locations) => {
    return {
        type: ActionTypes.SET_LOCATIONS,
        payload: locations
    }
}

export const addPolygons = (polygonObj) => {
    return {
        type: ActionTypes.ADD_POLYGONS,
        payload: polygonObj
    }
}

export const setPolygons = (polygons) => {
    return {
        type: ActionTypes.SET_POLYGONS,
        payload: polygons
    }
}