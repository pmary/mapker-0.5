/*****************************************************************************/
/* Local function declaration */
/*****************************************************************************/
/**
 * @summary Find the places that are within the current map viewable zone and that one
 * of it's activities match with the given keywords
 * @param {Object} searchObject - Contain the search parameters
 * @param {String} searchObject.keywords - Activities keywords
 * @param {Array} searchObject.bbox - Bounding box coordinates of the current map focus
 */
var searchPlacesByActivitiesAndBbox = function(searchObject) {
	// Query the ES index via the Meteor method and return the results
	//console.log(searchObject);
	Meteor.call('getPlaces', searchObject, function(error, result) {
		if (error) return console.log(error);

		//console.log(result);

		// If there is no result
		if (!result.length)
			return Session.set('searchPlacesResults', "no-result");

		// Format the results
		var places = [];
		for (var i = 0; i < result.length; i++) {
			result[i]._source._id = result[i]._id;
			places.push(result[i]._source);
		}

		Session.set('searchPlacesResults', places);

		// Display the results on the map
		for (var y = 0; y < places.length; y++) {
			//console.log(places[i]);
			var resource = places[y];
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

		// If they was no bbox provided
		if (!searchObject.bbox) {
			var group = new L.featureGroup(markers);
			map.fitBounds(group.getBounds(), {paddingTopLeft: [750, 30], paddingBottomRight: [30, 30]});
		}
	});
};

/**
 * @summary Prepare the UI and create the search object for the query
 * @fires searchPlacesByActivitiesAndBbox Call the function to query the index, passing the object
 */
var buildAndFiresSearch = function() {
	// Remove the no-search class from #search-container to display the result area
	$('.mapker-place-search#search-container').removeClass('no-search');

	// Clear map
	clearMap();
	// Reset the marker list
	markers = [];
	// Reset the search results
	Session.set('searchPlacesResults', '');

	// Get the input values
	var location = $('.mapker-place-search #mapker-places-input-where').val(),
	keywords = $('.mapker-place-search #mapker-places-input-what').val(),
	searchObject;
	if (location.length > 2) {
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
					map.fitBounds([bounds], {paddingTopLeft: [750, 0]});

					searchObject = {queryString: keywords, bbox: bbox};
					searchPlacesByActivitiesAndBbox(searchObject);
				}
			}
		});
	}
	else {
		// See https://www.mapbox.com/mapbox.js/api/v2.1.9/l-latlngbounds/
		/*var left = map.getBounds().getWest(),
		bottom = map.getBounds().getSouth(),
		right = map.getBounds().getEast(),
		top = map.getBounds().getNorth(),
		bbox = [ left, bottom, right, top ];
		console.log(bbox);*/

		searchObject = {queryString: keywords/*, bbox: bbox*/};
		searchPlacesByActivitiesAndBbox(searchObject);
	}
};

var createIcon = function(resource) {
	return L.divIcon({
		iconSize: [30, 47],
		iconAnchor: [15, 42],
		popupAnchor: [-1, -40],
		html: '<span class="pin place-pin"></span>',
		className: 'leaflet-place-icon'
	});
};

var addMarker = function(marker) {
	// Get the layer in which added the marker
	//var resourceLayer = getResourceLayer(resource.type);
	//placeLayer.addLayer(marker);
	markerLayerGroup.addLayer(marker);
	// Index the marker to access it easily after
	//markers[marker.options._id] = marker;
};

var clearMap = function() {
	markerLayerGroup.clearLayers();
};

var addPopup = function(marker, resource) {
	if (resource.avatar) {
		marker.bindPopup('<div class="popup">' +
			'<div class="avatar" style="background-image: url(' + resource.avatar.url + ' )"></div>' +
			'<div class="infos">' +
				'<div class="info-v-center">' +
					'<h2>' + resource.name + '</h2>' +
					'<p>' + resource.formattedAddress + '</p>' +
				'</div>' +
			'</div>' +
		'</div>');
	}
	else {
		marker.bindPopup('<div class="popup">' +
			'<div class="avatar" style="background-image: url( /images/avatar-place-default.png )"></div>' +
			'<div class="infos">' +
				'<div class="info-v-center">' +
					'<h2>' + resource.name + '</h2>' +
					'<p>' + resource.formattedAddress + '</p>' +
				'</div>' +
			'</div>' +
		'</div>');
	}

};


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
	places: function () {
		return Session.get("searchPlacesResults");
	}
});


/*****************************************************************************/
/* Meteor on rendered function */
/*****************************************************************************/
var map, markerLayerGroup;
var markers = []; // Our marker list
Template.searchPlaces.rendered = function() {
	// Clear the session var to prevent displaying results from an old search
	Session.set("searchPlacesResults", []);

	// Set the focus on the what input field
	$('.mapker-place-search #mapker-places-input-what').focus();

	this.autorun(function () {
		// Set the menu item as active
		$('#primary-navbar #main-menu li').removeClass('active');
		$('#primary-navbar #main-menu #menu-item-places').addClass('active');

		if (Mapbox.loaded()) {
			L.mapbox.accessToken = 'pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			// Return if Map is already initialized
			map = L.mapbox.map('mapker-places-search-map', 'examples.map-i86nkdio', {zoomControl: false})
			.setView([40, -20.50], 3);
			//map.addLayer("placeLayer");

			// Disable touch and whell zoom
			map.touchZoom.disable();
			map.scrollWheelZoom.disable();

			// Set the zoom controls at the bottom right
			new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

			markerLayerGroup = L.layerGroup([]);
			map.addLayer(markerLayerGroup);

			//console.log(map.getBounds());
		}
	});

	/**
	 * @summary AutoComplete init. for the skills input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	var currentWhatQueryString;
	$('.mapker-place-search #mapker-places-input-what').autocomplete({
		position: "absolute",
		appendTo: $('.mapker-place-search .input-what-container'),
		lookup: function(queryString, done) {
			// No search if the query string lenght < 2 characters
			// Or if the input text hasn't change
			if (queryString.length < 2 || queryString == currentWhatQueryString) return;
			currentWhatQueryString = queryString;

			// Search places matching with the current input values
			buildAndFiresSearch();

			// Get the suggestions according to the queryString
			Meteor.call('getActivitiesSuggestions', queryString, function(error, result) {
				// Display the error to the user and abort
				if (error) {
						throw error;
				}

				var formatedResult = {
					suggestions: $.map(result, function(dataItem) {
						return { value: dataItem.text, data: dataItem.text };
					})
				};

				done(formatedResult);
			});
		},
		onSelect: function (suggestion) {
			//console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
			// Search places matching with the current input values
			buildAndFiresSearch();
		}
	});

	/**
	 * @summary AutoComplete init. for the location input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	var currentLocationQueryString;
	$('.mapker-place-search #mapker-places-input-where').autocomplete({
		position: "absolute",
		appendTo: $('.mapker-place-search .input-where-container'),
		lookup: function(queryString, done) {
			// No search if the query string lenght < 2 characters
			// Or if the input text hasn't change
			if (queryString.length < 2 || queryString == currentLocationQueryString) return;
			currentLocationQueryString = queryString;

			queryString = encodeURIComponent(queryString.replace(/ /g, "+"));
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + queryString + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					if (content.features && content.features.length) {
						//console.log(content.features);
						var results = content.features.slice(0, 10);

						var formatedResult = {
							suggestions: $.map(results, function(dataItem) {
								return { value: dataItem.place_name, data: dataItem.place_name };
							})
						};

						done(formatedResult);
					}
				}
			});
		},
		onSelect: function (suggestion) {
			//console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
			// Search places matching with the current input values
			buildAndFiresSearch();
		}
	});
};


/*****************************************************************************/
/* Meteor events */
/*****************************************************************************/
Template.searchPlaces.events({
	'submit #mapker-places-search-form': function(e,t) {
		console.log('submit .search-form');
		e.preventDefault();
		// Search places matching with the current input values
		buildAndFiresSearch();
	},
	'mouseover .result': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place-hover";
			}
		}
	},
	'mouseout .result': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place";
			}
		}
	},
	'click .user-action-zoom-to': function(e, t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				map.setView(markers[i].getLatLng(), 13);
				map.panBy([-350, 0]);
				markers[i]._icon.firstElementChild.className = "pin pin-place-hover";
				markers[i].openPopup();
			}
		}
	}
});
