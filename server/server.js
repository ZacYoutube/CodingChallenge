const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // added cors to relax the security applied to an API

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

app.locals.idIndex = 3;
app.locals.locations = initialLocations;

app.get('/locations', (req, res) => res.send({ locations: initialLocations }));
app.post('/new-locations', (req, res) => {
  const index = app.locals.idIndex + 1;
  const locationObj = req.body;

  const lat = locationObj.lat;
  const lng = locationObj.lng;
  const name = locationObj.name;

  if (validateLngAndLat(lng, lat) && validateLocationName(name)) {
    const newLocations = {
      id: `id${index}`,
      name: name,
      lat: Number(lat),
      lng: Number(lng)
    };
    app.locals.idIndex = index;
    app.locals.locations.push(newLocations)
    console.log(initialLocations)
    res.send({ locations: initialLocations });
  }
  else if (!validateLngAndLat(lng, lat)) {
    res.status(400).send({ error: "Please enter valid longitude and latitude. Note that a valid longitude is between -180 and 180, and a valid latitude is between -90 and 90." });
  }
  else if (!validateLocationName(name)) {
    res.status(400).send({ error: "Please enter proper city name, in the format of 'New York'. Watch out for upper cases and spaces." });
  }
});

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

function validateLocationName(name) {
  // a naive way is to use regex to allow user only input format like 'New York' with upper 
  // cases on each separated word, and a space in between if there is more than one word.
  const locationNameRegex = /^[a-zA-Z\s]+$/;

  return locationNameRegex.test(name);
}
