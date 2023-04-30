const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const dotenv = require("dotenv")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // added cors to relax the security applied to an API
dotenv.config(); // loads environment variables from a .env file into process.env

const API_KEY = process.env.NODE_ENV === 'production' ? process.env.MAPBOX_API_KEY : process.env.REACT_APP_MAPBOX_API_KEY_LOCAL;

const initialLocations = [
  {
    id: 'id1',
    name: 'Denver',
    lat: 39.742043,
    lng: -104.991531,
  },
  {
    id: 'id2',
    name: 'LA',
    lat: 34.052235,
    lng: -118.243683,
  },
  {
    id: 'id3',
    name: 'Boston',
    lat: 42.364506,
    lng: -71.038887,
  },
];

const polygonList = [];

app.locals.idIndex = 3;
app.locals.locations = initialLocations;
app.locals.polygons = polygonList;

app.get('/locations', (req, res) => res.send({ locations: initialLocations }));
app.get('/polygons', (req, res) => res.send({ polygons: polygonList }))
app.post('/new-locations', async (req, res) => {
  const index = app.locals.idIndex + 1;
  const locationObj = req.body;

  const lat = locationObj.lat;
  const lng = locationObj.lng;
  const name = locationObj.name;

  let isLocationValid = await validateLocationName(name);
  let isLngLatValid = validateLngAndLat(lng, lat);

  if (isLocationValid && isLngLatValid) {
    const newLocations = {
      id: `id${index}`,
      name: name,
      lat: Number(lat),
      lng: Number(lng)
    };
    app.locals.idIndex = index;
    app.locals.locations.push(newLocations)
    res.send({ locations: initialLocations });
  }
  else if (!isLngLatValid && !isLngLatValid) {
    res.status(400).send({ error: "Please enter proper city name and coordinates." });
  }
  else if (!isLocationValid) {
    res.status(400).send({ error: "Please enter proper city name." });
  }
  else if (!isLngLatValid) {
    res.status(400).send({ error: "Please enter valid longitude and latitude. Note that a valid longitude is between -180 and 180, and a valid latitude is between -90 and 90." });
  }
});

app.post('/new-polygons', (req, res) => {
  const feature = req.body.feature;
  const newPolygon = {
    id: feature.id,
    coordinates: feature.geometry.coordinates,
    type: feature.geometry.type
  }

  app.locals.polygons.push(newPolygon);
  res.send({ polygons: polygonList });
})

app.delete('/delete-polygon/:id', (req, res) => {
  const polygonIndex = app.locals.polygons.findIndex(({ id }) => id === req.params.id);
  if (polygonIndex >= 0) {
    app.locals.polygons.splice(polygonIndex, 1);
  }
})

app.delete('/delete-marker/:id', (req, res) => {
  const markerIndex = app.locals.locations.findIndex(({ id }) => id === req.params.id);
  if (markerIndex >= 0) {
    app.locals.locations.splice(markerIndex, 1);
  }
})

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

const portNumber = process.env.PORT || 3001;

app.listen(portNumber, () => {
  console.log('RrrarrrrRrrrr server alive on port 3001');
});

function validateLngAndLat(lng, lat) {
  // searched online and get the range of valid lng and lat
  return (lng > -180 && lng < 180) && (lat > -90 && lat < 90);
}

async function validateLocationName(name) {
  // use mapbox's places api to validate whether input is a valid city/country
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=${API_KEY}`;
  const placeResponse = await axios.get(url);
  const features = placeResponse.data.features;

  return (features.length > 0 && (features[0].place_type.includes('place')) || features[0].place_type.includes('country'));
}

