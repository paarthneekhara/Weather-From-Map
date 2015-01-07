# Weather-From-Map
A google maps api extension to get weather for selected points/path using the openweather api.

Weather-from-maps is a simple java script plugin that provides a set of fuctions to get weather details from google maps layers like markers, path etc using openweather api.

<h2>Basic Usage</h2>

Add the following in the ```<head>``` tag of html
```javascript
<script src="http://maps.googleapis.com/maps/api/js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="PATH_TO_FILE/script/weatherFromMap.js"></script>
```
Create a google maps container and a button to test using:
```html
<div id = "googleMap" style="height: 450px; width: 700px;"></div>
<button onclick = "getWeather()">Go!!</button>
```
Create a new google map with an onclick event handler defined to create a marker (you may create a custom map yourself, and use the functions for map layers.) 
```javascript
var markerMap;
$( document ).ready(function() {
  var map_element = document.getElementById('googleMap');
  markerMap = createMarkerMap(map_element);
});
```
Create multiple markers on the map, and you may get the weather details of the marker as a JSON object using the following code:
```javascript
function getWeather(){
  //get a selected marker from the markerMap object
  var marker = markerMap['markers'][0];
  var weather = marker.GetCurrentWeatherAtMarker();
  //weather is JSON object of current weather at current point. TO know more about it visit www.openweathermap.org
  alert(JSON.stringify(weather, null, 4));
}
```
To get weather details of positions along a polyline refer to examples/marineWeatherOnShipRoute.html
<h2>Methods</h2>

<i>1. createPolyLineMap(map_element : DOM element, map_prop : Object, poly_options : Object)</i>
<br>
This creates a map in the container identified by map_element which creates a polyline by clicking and creating arious markers. It returns an object of the type
```javascript
{
  map: map,
  polyline: polyline
}
```
<i>2. createMarkerMap(map_element : DOM element, map_prop : Object)</i>
<br>
This creates a map in the container identified by map_element which creates an array of markers on click and returns an object of the type
```javascript
{
  map: map,
  markers: markers
}
```
<i>3. google.maps.LatLng.prototype.GetCurrentWeatherAtPoint(custom_url : String)</i>
<br>
returns weather at a position on the map. custom_url is optional. It will override default url used for weather  query.
<br><br>
<i>4. google.maps.Marker.prototype.GetCurrentWeatherAtMarker(custom_url : String)</i>
<br>
returns weather at the given marker on the map. custom_url is optional. It will override default url used for weather  query.
<br><br>
<i>5. google.maps.Polyline.prototype.GetCurrentWeatherAtDistance(metres, custom_url : String)</i>
<br>
returns weather at the given distance from the start marker aong a polyline on the map. custom_url is optional. It will override default url used for weather  query.
<br><br>
<i>6. google.maps.LatLng.prototype.GetForecastAtPoint(custom_url : String)</i>
<br>
returns weatherforecast at a position on the map. custom_url is optional. It will override default url used for weather  query.
<br><br>
<i>7. google.maps.Marker.prototype.GetForecastAtMarker(custom_url : String)</i>
<br>
returns weather at the given marker on the map. custom_url is optional. It will override default url used for weather  query.
<br><br>
<i>8. google.maps.Polyline.prototype.GetForecastAtDistance(metres, custom_url : String)</i>
<br>
returns weather at the given distance from the start marker aong a polyline on the map. custom_url is optional. It will override default url used for weather  query.
<br>
