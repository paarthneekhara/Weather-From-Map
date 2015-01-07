
function createPolyLineMap(map_element, map_prop, poly_options) {
	if(!map_prop){
		var mapProp = {
			center:new google.maps.LatLng(51.508742,-0.120850),
			zoom:5,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		 var map=new google.maps.Map(map_element,mapProp);
	}
	else{
		 var map=new google.maps.Map(map_element,map_prop);
	}
	if(!poly_options){
		var polyOptions = {
		    strokeColor: '#000000',
		    strokeOpacity: 1.0,
		    strokeWeight: 3
		};
		 var polyline = new google.maps.Polyline(polyOptions);
	}
	else{
		 var polyline = new google.maps.Polyline(poly_options);
	}
	
	polyline.setMap(map);
	google.maps.event.addListener(map, 'click', function(event){
		var path = polyline.getPath();
		path.push(event.latLng);
		var marker = new google.maps.Marker({
			position: event.latLng,
			title: '#' + path.getLength(),
			map: map
		});
	});

	var polyLineMap = {
		map : map,
		polyline : polyline
	}

	return polyLineMap;
}


function createMarkerMap(map_element, map_prop, poly_options){
	var markers = [];
	if(!map_prop){
		var mapProp = {
			center:new google.maps.LatLng(51.508742,-0.120850),
			zoom:5,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		 var map=new google.maps.Map(map_element,mapProp);
	}
	else{
		 var map=new google.maps.Map(map_element,map_prop);
	}
	
	
	google.maps.event.addListener(map, 'click', function(event){
		
		var marker = new google.maps.Marker({
			position: event.latLng,
			map: map
		});
		markers.push(marker);
	});
	var markerMap = {
		map : map,
		markers : markers
	}

	return(markerMap);
	
}



//*********************** DISTANCE FORMULAE *****************************************

google.maps.LatLng.prototype.distanceFrom = function(newLatLng) {
  var EarthRadiusMeters = 6378137.0; // meters
  var lat1 = this.lat();
  var lon1 = this.lng();
  var lat2 = newLatLng.lat();
  var lon2 = newLatLng.lng();
  var dLat = (lat2-lat1) * Math.PI / 180;
  var dLon = (lon2-lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = EarthRadiusMeters * c;
  return d;
}

google.maps.LatLng.prototype.latRadians = function() {
  return this.lat() * Math.PI/180;
}

google.maps.LatLng.prototype.lngRadians = function() {
  return this.lng() * Math.PI/180;
}


// === A method which returns the length of a path in metres ===
google.maps.Polyline.prototype.Distance = function() {
  var dist = 0;
  for (var i=1; i < this.getPath().getLength(); i++) {
    dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));
  }
  return dist;
}


google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
  // some awkward special cases
  if (metres == 0) return this.getPath().getAt(0);
  if (metres < 0) return null;
  if (this.getPath().getLength() < 2) return null;
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
    olddist = dist;
    dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));
  }
  if (dist < metres) {
    return null;
  }
  var p1= this.getPath().getAt(i-2);
  var p2= this.getPath().getAt(i-1);
  var m = (metres-olddist)/(dist-olddist);
  return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
}

// === A method which returns an array of GLatLngs of points a given interval along the path ===
google.maps.Polyline.prototype.GetPointsAtDistance = function(metres) {
  var next = metres;
  var points = [];
  // some awkward special cases
  if (metres <= 0) return points;
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength()); i++) {
    olddist = dist;
    dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i-1));
    while (dist > next) {
      var p1= this.getPath().getAt(i-1);
      var p2= this.getPath().getAt(i);
      var m = (next-olddist)/(dist-olddist);
      points.push(new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m));
      next += metres;    
    }
  }
  return points;
}

//******************************************** GET WEATHER DATA *****************************************************

//**************************************************** current weather *********************************************************

google.maps.LatLng.prototype.GetCurrentWeatherAtPoint = function(custom_url){
  var lat = this.lat();
  var lon = this.lng();
  if(!custom_url){
    return GetWeatherData(lat, lon, 'weather');
  }
  else{
    return GetWeatherData(lat, lon, 'weather', custom_url)
  }
}

google.maps.Marker.prototype.GetCurrentWeatherAtMarker = function(custom_url){
	return this.position.GetCurrentWeatherAtPoint(custom_url);
}


google.maps.Polyline.prototype.GetCurrentWeatherAtDistance = function(metres, custom_url){
  return this.GetPointAtDistance(metres).GetCurrentWeatherAtPoint(custom_url);
}

//**************************************************** weather forecast ********************************************************

google.maps.LatLng.prototype.GetForecastAtPoint = function(custom_url){
  var lat = this.lat();
  var lon = this.lng();
  if(!custom_url){
    return GetWeatherData(lat, lon, 'forecast/daily');
  }
  else{
    return GetWeatherData(lat, lon, 'forecast/daily', custom_url)
  }
}

google.maps.Marker.prototype.GetForecastAtMarker = function(custom_url){
  return this.position.GetCurrentWeatherAtPoint(custom_url);
}


google.maps.Polyline.prototype.GetForecastAtDistance = function(metres, custom_url){
  return this.GetPointAtDistance(metres).GetCurrentWeatherAtPoint(custom_url);
}

function GetWeatherData(latitude, longitude, type, custom_url) {
    var temperature = 0;
    //var dfd = $.Deferred();
    if(!custom_url){
      var url = "http://api.openweathermap.org/data/2.5/" + type + "?lat=";
      url += latitude;
      url += "&lon=";
      url += longitude;
      url += "&cnt=16";
      url += "&mode=json";
    }
    else{
      var url = custom_url;
      url += "lat=";
      url +=latitude;
      url += "&lon=";
      url += longitude;
      url += "&cnt=16";
      url += "&mode=json";
    }
    
    var returnWeather;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        async: false,
        success: function (data) {
            returnWeather = data;
        },
        error: function (errorData) {
            alert("Error while getting weather data :: " + errorData.status);
        }
    });
    return returnWeather;
}