import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocations, addMarkers, setPolygons, addPolygons } from '../redux/action/actions';
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
  const [newLocationName, setName] = useState("");
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

  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style,
      center: [lng, lat],
      zoom
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
      console.log(data);
      const actionType = e.type;
      const dataType = e.features[0].geometry.type;
      console.log(dataType)
      if (actionType == 'draw.create') {
        if (dataType == 'Point' && data.features.length > 0) {
          const features = data.features[data.features.length - 1];
          const location = features.geometry.coordinates;
          const lng = location[0];
          const lat = location[1];
          setLng(lng);
          setLat(lat);
          toggleModal()
        }
        else if(dataType == 'Polygon' && data.features.length > 0) {
          for(const feature of data.features) {
            addPolygon(feature);
          }
        }

      }

    }

    return () => {
      map.current.remove();
    }
  }, []);

  useEffect(() => {
    // step 1 of the task: Load the original three locations from the server and display the markers
    function fetchLocations() {
      // use the predefined get location api
      axios.get("http://localhost:3001/locations")
        .then((response) => {
          const data = response.data;
          dispatch(setLocations(data.locations))
        })
    }

    function fetchInitialPolygons() {
      axios.get("http://localhost:3001/polygons")
        .then((response) => {
          const data = response.data;
          dispatch(setPolygons(data.polygons));
        })
    }

    fetchLocations()
    fetchInitialPolygons()

  }, []);

  useEffect(() => {
    for (const location of locationList) {
      new maplibregl.Marker()
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
    }
  }, [locationList]);

  console.log(polygons);
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
    axios.post("http://localhost:3001/new-locations", {
      name: newLocationName,
      lng: newLocationLng,
      lat: newLocationLat
    })
      .then((_) => {
        // if succeed, center a marker in the map and close the modal
        map.current.setCenter([newLocationLng, newLocationLat]);
        setOpen(false);
        setErroMsg("");
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

  function addPolygon(feature) {
    axios.post('http://localhost:3001/new-polygons', { feature: feature })
      .then((_) => {
        dispatch(addPolygons({
          id: feature.id,
          coordinates: feature.geometry.coordinates,
          type: feature.geometry.type
        }))
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
          <button id="submit-btn" onClick={addMarker}>Add</button>
        </Modal.Footer>
      </Modal>
      <button id="add-marker-btn" onClick={toggleModal}>Add Marker</button>
      <div ref={mapContainerRef} className="map" />
    </div>
  );
}
