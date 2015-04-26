Meteor.startup(function(){
    Mapbox.load();
});

Template.searchPlaces.helpers({
	searchTerms: function () {
		return Session.get('searchTerms');
	},
	locationsResults: function () {
		return Session.get("locationsResults");
	},
	places: function () {
		return Session.get("searchPlacesResults");
	}
});

var map, markerLayerGroup;
var markers = []; // Our marker list
Template.searchPlaces.rendered = function() {
	Session.set("locationsResults", []);
	// Clear the session var to prevent displaying results from an old search
	Session.set("searchPlacesResults", []);

	// If we have already subscribe for places, clear it
	if (resultPlacesSubscription != null)
  		resultPlacesSubscription.stop();

	$('#input-what').focus();

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
	$('#input-where').selectize({
		valueField: 'place_name',
		labelField: 'place_name',
		searchField: 'place_name',
		maxItems: 1,
		create: false,
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
			if (!query.length) return callback();
			query = encodeURIComponent(query.replace(/ /g, "+"));
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					if (content.features && content.features.length) {
						callback(content.features.slice(0, 10));
					};
				}
			});
		}
	});

	$searchWhat = $('#input-what').selectize({
		valueField: 'activity',
		labelField: 'activity',
		searchField: 'activity',
		sortField: 'activity',
		persist: true,
		maxItems: 1,
		create: false,
		highlight: false,
		addPrecedence: false,
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.activity) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('placesAutocompleteByActivities', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				//console.log(result)
				
				var myResult = [];
				for (var i = 0; i < result.length; i++) {
					myResult.push({activity: result[i].activities[0]});
				};
				callback(myResult);
			});
		},
		onItemAdd: function(value, $item) {
			//console.log(value);
			/*value = JSON.parse(value);
			if (event && event.keyCode == 13) {
				event.stopPropagation();
				searchWhat.clear();
				searchWhat.blur();
				$("#input-what-container .selectize-input input").val(Session.get('searchTerms'));
				Router.go('search');
			} else {
				Router.go('placeProfileAbout', {_id: value._id});
			}*/
		},
		onItemRemove: function(value, $item) {
			$('#input-where').val("");
		},
		onType: function(str) {
			//Session.set('searchTerms', str);
		},
		onFocus: function() {
		},
		onBlur: function(){
			//$("#input-what-container .selectize-input input").val(Session.get('searchTerms'));
		}
	});

	/*$("#input-what-container .selectize-input input").keyup(function(e) {
		if (e && e.keyCode == 13) {
			e.stopPropagation();
			searchWhat.clear();
			searchWhat.blur();
			$("#navbar-search .selectize-input input").val(Session.get('searchTerms'));
			Router.go('search');
		}
	});*/

	searchWhat = $searchWhat[0].selectize;
	$("#input-what-container .selectize-input input").val(Session.get('searchTerms'));
	Session.set('searchTerms', "");

	// Lauch the search
	Meteor.setTimeout(function() {
		$("#input-what-container .selectize-input input").keyup();
		searchWhat.open();
	}, 200);
}


var resultPlacesSubscription;
Template.searchPlaces.events({
	'keyup #input-where': function(e,t) {
		if (t.find('#input-where').value.length < 2)
			return;

		var query = t.find('#input-where').value.replace(/ /g, "+");
		var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
		
		// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
		Meteor.http.get(queryUrl, function (error, result) {
			if (!error) {
				var content = JSON.parse(result.content);
				if (content.features && content.features.length) {
					Session.set("locationsResults", content.features);
				};
			}
		});
	},
	'mousedown .search-location-result': function(e,t) {
		t.find('#input-where').value = e.currentTarget.innerHTML;
	},
	"focusout #input-where" : function(e,t) {
		Session.set('locationsResults', []);
	},
	'submit #search-form': function(e,t) {
		e.preventDefault();

		// Clear map
		clearMap();
		// Reset the marker list
		markers = [];

		var location = t.find('#input-where').value,
		keywords = t.find('#input-what').value;
		console.log(location);

		if (location.length > 2) {
			var query = location.replace(/ /g, "+");
			var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			
			// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/

			//db.places.find({ "loc": {$within: {$box: [[48.81701299999982, 2.2242194999998044], [48.90197349999985, 2.4648354999997926]]}} } )

			Meteor.http.get(queryUrl, function (error, result) {
				if (!error) {
					var content = JSON.parse(result.content);
					if (content.features && content.features.length) {
						var southWest = L.latLng(content.features[0].bbox[1], content.features[0].bbox[0]),
						northEast = L.latLng(content.features[0].bbox[3], content.features[0].bbox[2]),
						bounds = L.latLngBounds(southWest, northEast);
						map.fitBounds(bounds);

						// If we have already subscribe for places, clear it
						if (resultPlacesSubscription != null)
							resultPlacesSubscription.stop();

						var bbox = [[content.features[0].bbox[1], content.features[0].bbox[0]], [content.features[0].bbox[3], content.features[0].bbox[2]]];
						var searchObject = {queryString: keywords, bbox: bbox};
						searchPlacesByActivitiesAndBbox(searchObject);
					};
				}
			});
		}
		else {

			var currentBounds = map.getBounds();
			var bbox = [[currentBounds._southWest.lat, currentBounds._southWest.lng], [currentBounds._northEast.lat, currentBounds._northEast.lng]];
			var searchObject = {queryString: keywords, bbox: bbox};
			searchPlacesByActivitiesAndBbox(searchObject);
		}
	},
	'mouseover .place': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place-hover";
			}
		};
	},
	'mouseout .place': function(e,t) {
		var resourceId = e.currentTarget.dataset.id;
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				markers[i]._icon.firstElementChild.className = "pin pin-place";
			}
		};
	},
	/**
	 * @summary Display the map container
	 */
	'click #input-radio-place': function(e,t) {
		t.find('#map-container').className = 'col-md-5';
		t.find('#search-container').className = 'col-md-7';
	},
	/**
	 * @summary Hide the map container
	 */
	'click #input-radio-skills': function(e,t) {
		t.find('#map-container').className = 'hide';
		t.find('#search-container').className = 'col-md-12';
	}
});

/**
 * @summary Find the places that are within the current map viewable zone and that one 
 * of it's activities match with the given keywords
 * @param {Object} searchObject - Contain the search parameters
 * @param {String} searchObject.keywords - Activities keywords
 * @param {Array} searchObject.bbox - Bounding box coordinates of the current map focus
 */
var searchPlacesByActivitiesAndBbox = function(searchObject) {
	console.log(searchObject);
	Meteor.call('placesByActivitiesAndBbox', searchObject, function(error, result) {
		// Display the error to the user and abort
		if (error) return console.log(error.reason);
		console.log(result)
		
		Session.set("searchPlacesResults", result);
		setTimeout(function() {
			// Init focus point for the cover and avatars
			$('#search-page #search-results .place .cover').focusPoint();
			$('#search-page #search-results .place .avatar').focusPoint();
		}, 100);

		// Display the results on the map
		for (var i = 0; i < result.length; i++) {
			var resource = result[i];
			var latlng = new L.LatLng(resource.loc[0], resource.loc[1]);
			var marker = new L.Marker(latlng, {
				_id: resource._id,
				icon: createIcon(resource)
			});
			// Add the marker to our marker list
			markers.push(marker);

			addPopup(marker, resource);
							
			addMarker(marker);
		};
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