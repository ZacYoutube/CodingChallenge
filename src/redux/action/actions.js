import { ActionTypes, Endpoints, EnvStatus } from "../constant/constants";
import axios from 'axios';

const API_URL = process.env.NODE_ENV === EnvStatus.PROD ? Endpoints.HEROKU_URL : Endpoints.LOCALHOST_URL;

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

export const deleteMarker = (id) => {
    return {
        type: ActionTypes.DELETE_MARKER,
        payload: id
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

export const deletePolygon = (id) => {
    return {
        type: ActionTypes.DELETE_POLYGON,
        payload: id
    }
}

export function fetchLocationsAction() {
    // use the predefined get location api
    return dispatch => {
        return axios.get(`${API_URL}/locations`)
            .then((response) => {
                const data = response.data;
                // update the state from redux
                dispatch(setLocations(data.locations));
                return data;
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}


export function fetchPolygonsAction() {
    return dispatch => {
        return axios.get(`${API_URL}/polygons`)
            .then((response) => {
                const data = response.data;
                // update the state from redux
                dispatch(setPolygons(data.polygons));
                return data;
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}

export function addMarkerAction(newLocationName, newLocationLng, newLocationLat, locationList) {
    return dispatch => {
        return axios.post(`${API_URL}/new-locations`, {
            name: newLocationName,
            lng: newLocationLng,
            lat: newLocationLat
        })
            .then((response) => {
                // if succeed, dispatch to update state locations
                dispatch(addMarkers({
                    id: `id${locationList.length + 1}`,
                    name: newLocationName,
                    lng: Number(newLocationLng),
                    lat: Number(newLocationLat)
                }))
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}

export function removeMarkerAction(markerId) {
    return dispatch => {
        return axios.delete(`${API_URL}/delete-marker/${markerId}`)
            .then((_) => {
                // if succeed, dispatch to update state locations
                dispatch(deleteMarker(markerId));
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}


export function addPolygonAction(feature) {
    return dispatch => {
        return axios.post(`${API_URL}/new-polygons`, { feature: feature })
            .then((_) => {
                // if succeed, dispatch to update state polygons
                dispatch(addPolygons({
                    id: feature.id,
                    coordinates: feature.geometry.coordinates,
                    type: feature.geometry.type
                }))
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}

export function removePolygonAction(polygonId) {
    return dispatch => {
        return axios.delete(`${API_URL}/delete-polygon/${polygonId}`)
            .then((_) => {
                // if succeed, dispatch to update state polygons
                dispatch(deletePolygon(polygonId));
            })
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }
}