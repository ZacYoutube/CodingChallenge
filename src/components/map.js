import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocations, addMarkers, setPolygons, addPolygons, deletePolygon, deleteMarker } from '../redux/action/actions';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

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
  const locationList = useSelector((state) => state.markers.locations)
  const polygons = useSelector((state) => state.markers.polygons)
  const dispatch = useDispatch();
  const API_URL = 'https://maplibregl-exercise.herokuapp.com/';

  useEffect(() => {
    console.log(process.env.NODE_ENV)
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
          for (const feature of data.features) {
            addPolygon(feature);
          }
        }
      }
      if (actionType === 'draw.delete') {
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
    // step 1 of the task: Load the original three locations from the server and display the markers
    function fetchLocations() {
      // use the predefined get location api
      axios.get(`${API_URL}/locations`)
        .then((response) => {
          const data = response.data;
          // update the state from redux
          dispatch(setLocations(data.locations))
        })
    }

    // fetch the saved polygons from backend
    function fetchInitialPolygons() {
      axios.get(`${API_URL}/polygons`)
        .then((response) => {
          const data = response.data;
          // update the state from redux
          dispatch(setPolygons(data.polygons));
        })
    }

    fetchLocations()
    fetchInitialPolygons()

  }, []);

  useEffect(() => {
    // for loop for adding markers from redux state to the map
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

    // for loop for adding polygons from redux state to the map
    for (const polygon of polygons) {
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
    }
  }, [locationList, polygons]);

  function toggleModal() {
    setOpen(!openModal);
    setErroMsg("");
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
    axios.post(`${API_URL}/new-locations`, {
      name: newLocationName,
      lng: newLocationLng,
      lat: newLocationLat
    })
      .then((_) => {
        // if succeed, center a marker in the map and close the modal
        map.current.setCenter([newLocationLng, newLocationLat]);
        setOpen(false);
        setErroMsg("");
        // if succeed, dispatch to update state locations
        dispatch(addMarkers({
          id: `id${locationList.length + 1}`,
          name: newLocationName,
          lng: Number(newLocationLng),
          lat: Number(newLocationLat)
        }))
      }, (error) => {
        // display custom error messages on the modal
        const errorMessage = error.response.data.error;
        setErroMsg(errorMessage);
      });
  }

  function removeMarker(markerId) {
    axios.delete(`${API_URL}/delete-marker/${markerId}`)
      .then((_) => {
        // if succeed, dispatch to update state locations
        dispatch(deleteMarker(markerId));
      }, (error) => {
        console.log(error);
      })
  }

  function addPolygon(feature) {
    axios.post(`${API_URL}/new-polygons`, { feature: feature })
      .then((_) => {
        // if succeed, dispatch to update state polygons
        dispatch(addPolygons({
          id: feature.id,
          coordinates: feature.geometry.coordinates,
          type: feature.geometry.type
        }))
      }, (error) => {
        console.log(error);
      })
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
      <Modal show={openModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Marker</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <label>
            Location Name:
            <input type="text" name="name" value={newLocationName} onChange={(e) => { inputFieldOnChange(e, 0) }} />
          </label>
          <label>
            Location Longitude:
            <input type="number" name="lng" value={newLocationLng} onChange={(e) => { inputFieldOnChange(e, 1) }} />
          </label>
          <label>
            Location Latitude:
            <input type="number" name="lat" value={newLocationLat} onChange={(e) => { inputFieldOnChange(e, 2) }} />
          </label>
        </Modal.Body>
        <div className="error-message">{errorMsg}</div>
        <Modal.Footer>
          <button id="submit-btn" onClick={addMarker} disabled={newLocationName == null || newLocationLng == null || newLocationLat == null}>Add</button>
        </Modal.Footer>
      </Modal>
      <button id="add-marker-btn" onClick={toggleModal}>Add Marker</button>
      <div ref={mapContainerRef} className="map" />
    </div>
  );
}
