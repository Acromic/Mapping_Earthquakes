// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level. (LA coord)
// let map = L.map('mapid').setView([34.0522, -118.2437], 14);

// Create the map object with a center and zoom level. (Center coord)
// let map = L.map('mapid').setView([36.1733, -120.1794], 7);

// Center map to SFO and changed zoom (SFO center coord)
//let map = L.map('mapid').setView([37.6213, -122.3790], 5);

// GeoJSON example to san francisco
// Create the map object with center at the San Francisco airport.
// let map = L.map('mapid').setView([37.5, -122.5], 10);

// Create the map object with center and zoom level. GeoJSON
// let map = L.map('mapid').setView([30, 30], 2);

// street-v11 changed to light-v10
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// Satellite Streets
// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// Dark Map
// We create the dark view tile layer that will be an option for our map.
// let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   accessToken: API_KEY
// });

// Create a base layer that holds both maps.
let baseMaps = {
  Street: streets,
  // Dark: dark
  "Satellite": satelliteStreets
};

// Create the earthquake layer for our map.
let earthquakes = new L.LayerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
};

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays);


// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
  //center: [30, 30],
  center: [39.5, -98.5],
  //zoom: 2,
  zoom: 3,
  layers: [streets]
})

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the Toronto airline routes GeoJSON URL.
// module link/ let torontoData = "https://raw.githubusercontent.com/<GitHub_name>/Mapping_Earthquakes/main/torontoRoutes.json";
let torontoData = "https://raw.githubusercontent.com/Acromic/Mapping_Earthquakes/main/js/torontoRoutes.json";

// Accessing the Toronto neighborhoods GeoJSON URL.
let torontoHoods = "https://raw.githubusercontent.com/Acromic/Mapping_Earthquakes/main/js/torontoNeighborhoods.json";

// Then we add our 'graymap' tile layer to the map.
//  streets.addTo(map);

// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/Acromic/Mapping_Earthquakes/main/js/majorAirports.json";

// Grabbing our GeoJSON data. Toronto
// d3.json(torontoData).then(function(data) {
//   console.log(data);

//Grabbing our GeoJSON data torontoHoods
d3.json(torontoHoods).then(function (data) {
  console.log(data);

  // GeoJSON with layer and colors
  L.geoJSON(data, {
    style: myStyle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3> Airline: " + feature.properties.airline + "</h3> <hr><hr> Destination: ")
    }
  })
    .addTo(map);
});

// Create a style for the lines.
let myStyle = {
  color: "#ffffa1",
  weight: 1
}

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {

    // We turn each feature into a circleMarker on the map.

    pointToLayer: function (feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
    // We set the style for each circlemarker using our styleInfo function
    style: styleInfo,
    // We create a popup for each circleMarker to display the magnitude and
    //  location of the earthquake after the marker has been created and styled.
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);

  // Then we add the earthquake layer to our map.
  earthquakes.addTo(map);

});

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

// Creating a GeoJSON layer with the retrieved data.
// L.geoJSON(data).addTo(map);
// });

// Grabbing our GeoJSON data.
// d3.json(airportData).then(function (data) {
//   console.log(data);
//   // Creating a GeoJSON layer with the retrieved data.
//   L.geoJSON(data).addTo(map);
// });

// Add GeoJSON data.
// let sanFranAirport =
// {
//   "type": "FeatureCollection", "features": [{
//     "type": "Feature",
//     "properties": {
//       "id": "3469",
//       "name": "San Francisco International Airport",
//       "city": "San Francisco",
//       "country": "United States",
//       "faa": "SFO",
//       "icao": "KSFO",
//       "alt": "13",
//       "tz-offset": "-8",
//       "dst": "A",
//       "tz": "America/Los_Angeles"
//     },
//     "geometry": {
//       "type": "Point",
//       "coordinates": [-122.375, 37.61899948120117]
//     }
//   }
//   ]
// };

// Grabbing our GeoJSON data.
// L.geoJSON(sanFranAirport).addTo(map);

// Coordinates for each point to be used in the polyline.
// let line = [
//   [33.9416, -118.4085],
//   [37.6213, -122.3790],
//   [40.7899, -111.9791],
//   [47.4502, -122.3088]
// ];

// Create a polyline using the line coordinates and make the line red. (line on map.)
// L.polyline(line, {
//   color: "yellow"
// }).addTo(map);

//  Add a marker to the map for Los Angeles, California.
// let marker = L.marker([34.0522, -118.2437]).addTo(map);

// Get data from cities.js
// let cityData = cities;

// Grabbing our GeoJSON data. 
// L.geoJSON(sanFranAirport, {
//   // We turn each feature into a marker on the map.
//   pointToLayer: function(feature, latlng) {
//     console.log(feature);
//     return L.marker(latlng)
//     .bindPopup("<h2>" + feature.properties.city + "</h2>");
//   }

// }).addTo(map);

// Grabbing our GeoJSON data. 
// L.geoJSON(sanFranAirport, {
//   // We turn each feature into a marker on the map. marker feature.
//   onEachFeature: function (feature, layer) {
//     console.log(layer);
//     layer.bindPopup("<h2>" + feature.properties.city + "</h2>");
//   }

// }).addTo(map);


// // An array containing each city's location, state, and population.
// let cities = [{
//   location: [40.7128, -74.0059],
//   city: "New York City",
//   state: "NY",
//   population: 8398748
// },
// {
//   location: [41.8781, -87.6298],
//   city: "Chicago",
//   state: "IL",
//   population: 2705994
// },
// {
//   location: [29.7604, -95.3698],
//   city: "Houston",
//   state: "TX",
//   population: 2325502
// },
// {
//   location: [34.0522, -118.2437],
//   city: "Los Angeles",
//   state: "CA",
//   population: 3990456
// },
// {
//   location: [33.4484, -112.0740],
//   city: "Phoenix",
//   state: "AZ",
//   population: 1660272
// }
// ];

// Loop through the cities array and create one marker for each city. (updated cities variable to cityData)
// Loop through the cities array and create one marker for each city. (updatedwith bindPopup)
// cityData.forEach(function (city) {
//   console.log(city)
//   L.circleMarker(city.location, {
//     // Add color skills drill
//     color: 'black',
//     fillColor: '#FFFFa1',
//     fillOpacity: 0.5,
//     radius: city.population / 80000
//   })
//     .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
//     .addTo(map);
// });

// // Add a circle to the map
// L.circle([34.0522, -118.2437], {
//   radius: 100
// }).addTo(map);

// // Change color of the circle marker
// var circle = L.circleMarker([34.0522, -118.2437], {
//   color: 'black',
//   fillColor: '#FFFFa1',
//   fillOpacity: 0.5,
//   radius: 300
// }).addTo(map);

// We create the tile layer that will be the background of our map. (dark map)
// let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   accessToken: API_KEY
// });

// Regular Map (regular map)
// let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   accessToken: API_KEY
// });

// Satellite street map
// let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//   attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   accessToken: API_KEY
// });

// Then we add our 'graymap' tile layer to the map.
// streets.addTo(map);
