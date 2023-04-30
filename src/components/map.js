import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLocationsAction, fetchPolygonsAction, addMarkerAction, removeMarkerAction, addPolygonAction, removePolygonAction } from '../redux/action/actions';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalPopup from './modal';

export default function Map(props) {
  const mapContainerRef = useRef();
  const map = useRef(null);
  const [openModal, setOpen] = useState(false);
  const [newLocationName, setName] = useState(null);
  const [newLocationLng, setLng] = useState(null);
  const [newLocationLat, setLat] = useState(null);
  const [errorMsg, setErroMsg] = useState("");
  const [lng] = useState(props.lng || -104.991531);
  const [lat] = useState(props.lat || 39.742043);
  const [style] = useState('https://devtileserver.concept3d.com/styles/c3d_default_style/style.json');
  const [zoom] = useState(14);
  const locationList = useSelector((state) => state.markerReducer.locations)
  const polygons = useSelector((state) => state.polygonReducer.polygons)
  const dispatch = useDispatch();
<<<<<<< HEAD
  const formData = [
    {
      displayName: "Location Name:",
      type: "text",
      placeholder: "Enter a valid location",
      value: newLocationName,
      onChange: inputFieldOnChange
    },
    {
      displayName: "Location Longitude:",
      type: "number",
      placeholder: "Enter a valid longitude",
      value: newLocationLng,
      onChange: inputFieldOnChange
    },
    {
      displayName: "Location Latitude:",
      type: "number",
      placeholder: "Enter a valid latitude",
      value: newLocationLat,
      onChange: inputFieldOnChange
    }
  ]

=======
  const API_URL = process.env.NODE_ENV === 'production' ? 'https://maplibregl-exercise.herokuapp.com' : 'http://localhost:3001';
>>>>>>> 0bbc442 (fixed an issue and deployment to heroku.)
  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style,
      center: [lng, lat],
      zoom,
    });
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
        point: true
      },
      defaultMode: 'draw_polygon'
    });
    map.current.addControl(draw, 'top-left');
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('draw.create', newDraw);
    map.current.on('draw.delete', newDraw);
    map.current.on('draw.update', newDraw);

    function newDraw(e) {
      const data = draw.getAll();
      const actionType = e.type;
      const dataType = e.features[0].geometry.type;
      if (actionType === 'draw.create') {
        // when user pins the point on map, also let user add marker on that point 
        // (not sure if thats whats asked, but keep this in case along with the add marker button)
        if (dataType === 'Point' && data.features.length > 0) {
          const features = data.features[data.features.length - 1];
          const location = features.geometry.coordinates;
          const lng = location[0];
          const lat = location[1];
          setLng(lng);
          setLat(lat);
          toggleModal()
        }
        else if (dataType === 'Polygon' && data.features.length > 0) {
          // if user creates/drew polygons, save the polygons
          for (const feature of data.features) {
            addPolygon(feature);
          }
        }
      }
      if (actionType === 'draw.delete') {
        // allows polygon deletion
        if (dataType === 'Polygon') {
          const polygonId = e.features[0].id;
          removePolygon(polygonId);
        }
      }

    }

    // Attach a click event listener to the map
    map.current.on('click', function (e) {
      // Get the clicked features
      var features = map.current.queryRenderedFeatures(e.point);
      // Find the clicked polygon feature - in my case, the polygons drew has same layer id and source id
      var polygons = features.filter(function (feature) {
        return feature.layer.id === feature.layer.source;
      });
      // If a polygon feature was clicked - display popup for allowing deletion
      if (polygons.length > 0) {
        var popup = new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<button id="delete-polygon-button">Delete</button>')
          .addTo(map.current);
        popup.getElement().querySelector("#delete-polygon-button").addEventListener('click', function () {
          const id = polygons[0].layer.id;
          removePolygon(id);
          if (map.current.getLayer(id)) {
            map.current.removeLayer(id);
          }
          popup.remove();
        });
      }
    });


    return () => {
      map.current.remove();
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD

    dispatch(fetchLocationsAction());
    dispatch(fetchPolygonsAction());
=======
    // step 1 of the task: Load the original three locations from the server and display the markers
    function fetchLocations() {
      // use the predefined get location api
      axios.get(`${API_URL}/locations`)
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          // update the state from redux
          dispatch(setLocations(data.locations))
        })
    }

    // fetch the saved polygons from backend
    function fetchPolygons() {
      axios.get(`${API_URL}/polygons`)
        .then((response) => {
          const data = response.data;
          // update the state from redux
          dispatch(setPolygons(data.polygons));
        })
    }

    fetchLocations()
    fetchPolygons()
>>>>>>> 0bbc442 (fixed an issue and deployment to heroku.)

  }, []);

  useEffect(() => {
    // forEach loop for adding markers from redux state to the map
    locationList.forEach((location, index) => {
      var popup = new maplibregl.Popup()
        .setHTML(`<div><div id="popup-title">${location.name}</div><div><button id="marker-button-${index}">Delete</button></div></div>`);

      var marker = new maplibregl.Marker()
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current);

      const handleDeleteClick = () => {
        marker.remove();
        popup.remove();
        removeMarker(location.id);
      }

      // add popup for allowing deletion
      popup.on('open', () => {
        const deleteButton = document.getElementById(`marker-button-${index}`);
        deleteButton.addEventListener('click', handleDeleteClick);
      });

    });

    // forEach loop for adding polygons from redux state to the map
    polygons.forEach((polygon, _) => {
      const layer = {
        id: polygon.id,
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: polygon.type,
              coordinates: polygon.coordinates
            }
          }
        },
        paint: {
          'fill-color': '#40b1ce',
          'fill-opacity': 0.5
        }
      }

      map.current.on('load', () => {
        map.current.addLayer(layer);
      });
    });

  }, [locationList, polygons]);

  // for toggling modal component
  function toggleModal() {
    setOpen(!openModal);
    setErroMsg("");
  }

  function resetInputs() {
    setName(null);
    setLng(null);
    setLat(null);
  }

  // emptying the input fields
  function resetInputs() {
    setName(null);
    setLng(null);
    setLat(null);
  }

  function inputFieldOnChange(e, index) {
    if (index === 0) {
      setName(e.target.value);
    }
    else if (index === 1) {
      setLng(e.target.value);
    }
    else {
      setLat(e.target.value);
    }
  }

  // step2 of the task, post request to send the new location data to the server
  function addMarker() {
    dispatch(addMarkerAction(newLocationName, newLocationLng, newLocationLat, locationList))
      .then((_) => {
        // if succeed, center a marker in the map and close the modal
        map.current.setCenter([newLocationLng, newLocationLat]);
        setOpen(false);
        setErroMsg("");
        resetInputs();
<<<<<<< HEAD
=======
        // if succeed, dispatch to update state locations
        dispatch(addMarkers({
          id: `id${locationList.length + 1}`,
          name: newLocationName,
          lng: Number(newLocationLng),
          lat: Number(newLocationLat)
        }))
>>>>>>> 0bbc442 (fixed an issue and deployment to heroku.)
      }, (error) => {
        // display custom error messages on the modal
        const errorMessage = error.response.data.error;
        setErroMsg(errorMessage);
        resetInputs()
      });
  }

  function removeMarker(markerId) {
    dispatch(removeMarkerAction(markerId));
  }

  function addPolygon(feature) {
    dispatch(addPolygonAction(feature));
  }

  function removePolygon(polygonId) {
    dispatch(removePolygonAction(polygonId))
  }

  function removePolygon(polygonId) {
    axios.delete(`${API_URL}/delete-polygon/${polygonId}`)
      .then((_) => {
        // if succeed, dispatch to update state polygons
        dispatch(deletePolygon(polygonId));
      }, (error) => {
        console.log(error);
      })
  }

  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a>

      <ModalPopup
        data={formData}
        error={errorMsg}
        onSubmit={addMarker}
        isOpen={openModal}
        toggle={toggleModal}
      />

      <button id="add-marker-btn" onClick={toggleModal}>Add Marker</button>

      <div ref={mapContainerRef} className="map" />
    </div>
  );
}





