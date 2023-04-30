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

export const deleteMarker = (id) => {
    return {
        type: ActionTypes.DELETE_MARKER,
        payload: id
    }
}

export const setPolygons = (polygons) => {
    return {
        type: ActionTypes.SET_POLYGONS,
        payload: polygons
    }
}

export const deletePolygon = (id) => {
    return {
        type: ActionTypes.DELETE_POLYGON,
        payload: id
    }
}