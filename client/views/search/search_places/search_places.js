/*****************************************************************************/
/* Local function declaration */
/*****************************************************************************/
/**
 * @summary Find the places that are within the current map viewable zone and that one 
 * of it's activities match with the given keywords
 * @param {Object} searchObject - Contain the search parameters
 * @param {String} searchObject.keywords - Activities keywords
 * @param {Array} searchObject.bbox - Bounding box coordinates of the current map focus
 * @param {Object} template - The searchPlaces template instance object
 */
var searchPlacesByActivitiesAndBbox = function(template, searchObject) {
	// Remove the no-search class from #search-container to display the result area
	$(template.find('#search-container')).removeClass('no-search');

	// Clear map
	clearMap();
	// Reset the marker list
	markers = [];

	console.log(searchObject)
	Meteor.call('getPlaces', searchObject, function(error, result) {		
		if (error)
			console.log(error);

		console.log(result);

		// If there is no result
		if (!result.length) 
			return Session.set('searchPlacesResults', "no-result");

		// Format the results
		var places = [];
		for (var i = 0; i < result.length; i++) {
			result[i]._source._id = result[i]._id;
			places.push(result[i]._source);
		};

		Session.set('searchPlacesResults', places);

		// Init the focus point for the covers
		setTimeout(function() {
			// Init focus point for the cover and avatars
			$('.search-place #search-results .cover').focusPoint();
		}, 100);

		// Display the results on the map
		for (var i = 0; i < places.length; i++) {
			//console.log(places[i]);
			var resource = places[i];
			var latlng = new L.LatLng(resource.loc.lat, resource.loc.lon);
			var marker = new L.Marker(latlng, {
				_id: resource._id,
				icon: createIcon(resource)
			});
			// Add the marker to our marker list
			markers.push(marker);

			addPopup(marker, resource);
							
			addMarker(marker);
		}
	});
}

var createIcon = function(resource) {
	return L.divIcon({
		iconSize: [30, 45],
		iconAnchor: [15, 42],
		popupAnchor: [-1, -40],
		html: '<span class="pin place-pin"></span>',
		className: 'leaflet-place-icon'
	});
}

var addMarker = function(marker) {
	// Get the layer in which added the marker
	//var resourceLayer = getResourceLayer(resource.type);
	//placeLayer.addLayer(marker);
	markerLayerGroup.addLayer(marker);
	// Index the marker to access it easily after
	//markers[marker.options._id] = marker;
}

var clearMap = function() {
	markerLayerGroup.clearLayers();
}

var addPopup = function(marker, resource) {
	//console.log(marker);
	marker.bindPopup("<h2>" + resource.name + "</h2>");
}


/*****************************************************************************/
/* Meteor Startup actions */
/*****************************************************************************/
Meteor.startup(function(){
    Mapbox.load();
});

/*****************************************************************************/
/* Meteor helpers */
/*****************************************************************************/
Template.searchPlaces.helpers({
	locationSuggestions: function () {
		return Session.get("locationSuggestions");
	},
	places: function () {
		return Session.get("searchPlacesResults");
	},
	/**
	 * @summary Return the suggestions returned when typing in the what input field
	 */
	whatSuggestions: function () {
		return Session.get("whatSuggestions");
	}
});


/*****************************************************************************/
/* Meteor on rendered function */
/*****************************************************************************/
var map, markerLayerGroup;
var markers = []; // Our marker list
Template.searchPlaces.rendered = function() {
	console.log("render");
	Session.set("locationSuggestions", []);
	// Clear the session var to prevent displaying results from an old search
	Session.set("searchPlacesResults", []);

	$('#input-what').focus();

	/**
	 * @todo Try to move the accessToken declaration server side only to keep it private
	 */
	this.autorun(function () {
		if (Mapbox.loaded()) {
			L.mapbox.accessToken = 'pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			// Return if Map is already initialized
			map = L.mapbox.map('map', 'examples.map-i86nkdio')
			.setView([40, -20.50], 3);
			//map.addLayer("placeLayer");
			markerLayerGroup = L.layerGroup([]);
			map.addLayer(markerLayerGroup);

			console.log(map.getBounds());
		}
	});

	// Selectize init. for the where input field
	$('.search-place #input-where').selectize({
		valueField: 'place_name',
		labelField: 'place_name',
		searchField: 'place_name',
		maxItems: 1,
		create: false,
		loadingClass: 'selectize-load',
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.place_name) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			console.log('load');
			if (!query.length) return callback();
			query = encodeURIComponent(query.replace(/ /g, "+"));
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					console.log(content);
					if (content.features && content.features.length) {
						callback(content.features.slice(0, 10));
					};
				}
			});
		},
		onType: function(str) {
			console.log('type');
		}
	});
}


/*****************************************************************************/
/* Meteor events */
/*****************************************************************************/
Template.searchPlaces.events({
	'mousedown .search-location-result': function(e,t) {
		//t.find('#input-where').value = e.currentTarget.innerHTML;
	},
	"focusout #input-where" : function(e,t) {
		//Session.set('locationSuggestions', []);
	},
	'submit #search-form': function(e,t) {
		// Hide the suggestion list
		$(template.find("#input-what-container .suggestions-container")).addClass("hide");

		e.preventDefault();

		// Get the input values
		var location = t.find('#input-where').value,
		keywords = t.find('#input-what').value;
		console.log(location);

		if (location.length > 2) {
			console.log('has location');
			var query = location.replace(/ /g, "+");
			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

			// Get the location data
			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					if (content.features && content.features.length) {
						// bbox = left,bottom,right,top
						var bbox = content.features[0].bbox;

						// Center the map on the given bounding box
						var southWest = L.latLng(content.features[0].bbox[1], content.features[0].bbox[0]),
						northEast = L.latLng(content.features[0].bbox[3], content.features[0].bbox[2]),
						bounds = L.latLngBounds(southWest, northEast);
						map.fitBounds(bounds);

						var searchObject = {queryString: keywords, bbox: bbox};
						searchPlacesByActivitiesAndBbox(t, searchObject);
					};
				}
			});
		}
		else {
			// See https://www.mapbox.com/mapbox.js/api/v2.1.9/l-latlngbounds/
			var left = map.getBounds().getWest();
			var bottom = map.getBounds().getSouth();
			var right = map.getBounds().getEast();
			var top = map.getBounds().getNorth();

			var bbox = [ left, bottom, right, top ];
			console.log(bbox);
			var searchObject = {queryString: keywords, bbox: bbox};
			searchPlacesByActivitiesAndBbox(t, searchObject);
		}
	},
	'mouseover .result': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place-hover";
			}
		};
	},
	'click': function(e,t) {
		// Hide the suggestion list
		$(t.find("#input-what-container .suggestions-container")).addClass("hide");
	},
	'mouseout .result': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place";
			}
		};
	},
	'focusin #input-what, click #input-what': function(e,t) {
		e.stopPropagation();
		// Display the suggestion list
		$(t.find("#input-what-container .suggestions-container")).removeClass("hide");
	},
	'keyup #input-what': function(e,t) {
		var queryString = t.find("#input-what").value;
		console.log(queryString);

		// Search places matching with the what input value
		var searchObject = {queryString: queryString};
		searchPlacesByActivitiesAndBbox(t, searchObject);

		// Get and display searcg suggestions according to the querySting
		Meteor.call('getActivitiesSuggestions', queryString, function(error, result) {
			console.log(result);
			// Display the error to the user and abort
			if (error) return console.log(error.reason);

			return Session.set("whatSuggestions", result);
		});
	},
	'click #input-what-container .suggestion-item': function(e,t) {
		// Set the input with the text of the suggestion item selected
		t.find('#input-what').value = e.currentTarget.dataset.text;

		// Hide the suggestion list
		$(t.find("#input-what-container .suggestions-container")).addClass("hide");
	}
});