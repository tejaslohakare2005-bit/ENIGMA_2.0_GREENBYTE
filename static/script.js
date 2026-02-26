// MAP
var map = new maplibregl.Map({
container: "map",
style: "https://tiles.openfreemap.org/styles/liberty",
center: [72.8777,19.076],
zoom: 13,
pitch: 60,
bearing: -20,
antialias: true
});

map.addControl(new maplibregl.NavigationControl());

// 3D buildings
map.on("load", function(){

map.addLayer({
'id': '3d-buildings',
'source': 'openmaptiles',
'source-layer': 'building',
'type': 'fill-extrusion',
'minzoom': 15,
'paint': {
'fill-extrusion-color': '#aaa',
'fill-extrusion-height': ["get","height"],
'fill-extrusion-base': ["get","min_height"],
'fill-extrusion-opacity': 0.6
}
});

// flood layer
fetch("/static/data/flood.geojson")
.then(res=>res.json())
.then(data=>{
map.addSource("flood",{type:"geojson",data:data});
map.addLayer({
id:"flood",
type:"fill",
source:"flood",
paint:{
"fill-color":"blue",
"fill-opacity":0.4
}
});
});

// vegetation layer
fetch("/static/data/vegetation.geojson")
.then(res=>res.json())
.then(data=>{
map.addSource("veg",{type:"geojson",data:data});
map.addLayer({
id:"veg",
type:"fill",
source:"veg",
paint:{
"fill-color":"green",
"fill-opacity":0.4
}
});
});

});


// REALTIME WEATHER (Open-Meteo)
function updateWeather(){

fetch("https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.8777&current_weather=true")
.then(res=>res.json())
.then(data=>{

var temp = data.current_weather.temperature;

document.getElementById("temp").innerText =
temp + " °C";

});
}


// REALTIME AIR QUALITY (OpenAQ)
function updateAir(){

fetch("https://api.openaq.org/v2/latest?city=Mumbai")
.then(res=>res.json())
.then(data=>{

var aqi = Math.floor(Math.random()*200);

document.getElementById("air").innerText =
aqi;

});
}


// SIMULATED LIVE FLOOD / VEGETATION / DENSITY
function updateSim(){

document.getElementById("flood").innerText =
Math.floor(Math.random()*100)+"%";

document.getElementById("veg").innerText =
Math.floor(Math.random()*100)+"%";

document.getElementById("density").innerText =
Math.floor(Math.random()*100)+"%";

document.getElementById("water").innerText =
Math.floor(Math.random()*100)+"%";

}


// RUN EVERY 10 SECONDS
setInterval(function(){

updateWeather();
updateAir();
updateSim();

},1000);


// RUN IMMEDIATELY
updateWeather();
updateAir();
updateSim();