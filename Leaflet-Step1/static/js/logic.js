// GOAL: Create a map using Leaflet that plots all of the earthquakes from our data set based on their long and lat
apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


var depthColors = ["#00FF09",  "#E5FF09", "#EFDF00", "#FFA000", "#FF5600", "#FF0000" ];
// Markers:
    // Color: Depth (greater -> darker)
    // Size: Mag
var myMap = L.map("map", {
    center: [39.833, -98.585], //middle of contiguous United States
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var legendContent = L.control({
    position: "bottomright"
})

legendContent.onAdd = function(){
    var legend = L.DomUtil.create("div", "legend");
    return legend;
}

legendContent.addTo(myMap);

console.log(legendContent)

// bring in data
d3.json(apiUrl, function (data) {
    console.log(data.features[0].geometry.coordinates)
    console.log(data.features[0].geometry.coordinates.slice(0, 2))
    console.log(data.features[0].properties.place)
    setUpQuakes(data);
    setUpLegend();
})

function setUpQuakes(geoData){
    for (eq of geoData.features){
        let mag = eq.properties.mag;
        let depth = eq.geometry.coordinates[2];
        let coords = eq.geometry.coordinates.slice(0, 2).reverse();
        var color;
        var when = new Date(eq.properties.time)
        if (depth > 90){
            color = "#FF0000"
        } else if (depth >= 70){
            color = "#FF5600"
        } else if (depth >= 50){
            color = "#FFA000"
        } else if (depth >= 30){
            color = "#EFDF00"
        } else if (depth >= 10){
            color = "#E5FF09"
        } else {
            color = "#00FF09"
        }
        L.circle(coords, {
            fillOpacity: 0.80,
            color: "black",
            fillColor: color,
            radius: mag * 15000
        }).bindPopup(`<h2 style="alignment: center">${eq.properties.place}</h2><ul>
            <li><b>Magnitude</b>: ${mag}</li>
            <li><b>Mag Type</b>: ${eq.properties.magType}</li>
            <li><b>Time Recorded</b>: ${when}</li>
        </ul>`).addTo(myMap);
    }
}

function setUpLegend(){
    var ranges = ["-10", "10", "30", "50", "70", "90"]
    var labels = []
    for (var i=0; i < ranges.length; i++){
        if (i < 5){
            labels.push(`<i style="background:${depthColors[i]}"></i>${ranges[i]} &ndash; ${ranges[i+1]} <br>`)
        } else {
            labels.push(`<i style="background:${depthColors[i]}"></i>${ranges[i]}+ <br>`)
        }
    }
    document.querySelector(".legend").innerHTML = labels.join("");
}