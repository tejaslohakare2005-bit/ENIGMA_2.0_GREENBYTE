// CREATE FREE MAP (OpenStreetMap)

var map = L.map("map").setView([19.0760, 72.8777], 11);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:"© OpenStreetMap"
}
).addTo(map);



// LOAD FLOOD LAYER

fetch("/static/data/flood.geojson")
.then(res=>res.json())
.then(data=>{

L.geoJSON(data,{
color:"blue",
fillOpacity:0.4
}).addTo(map);

});



// LOAD VEGETATION LAYER

fetch("/static/data/vegetation.geojson")
.then(res=>res.json())
.then(data=>{

L.geoJSON(data,{
color:"green",
fillOpacity:0.4
}).addTo(map);

});




// CLICK EVENT

map.on("click", function(e){

var lat = e.latlng.lat;
var lon = e.latlng.lng;


// show lat lon

document.getElementById("lat").innerText =
lat.toFixed(5);

document.getElementById("lon").innerText =
lon.toFixed(5);


// call backend

fetch(`/weather?lat=${lat}&lon=${lon}`)

.then(res=>res.json())

.then(data=>{

document.getElementById("temp").innerText =
data.temperature;

document.getElementById("flood").innerText =
data.flood;

document.getElementById("vegetation").innerText =
data.vegetation;

document.getElementById("water").innerText =
data.water;

document.getElementById("air").innerText =
data.air;

});

});