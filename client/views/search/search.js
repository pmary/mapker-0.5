Meteor.startup(function(){
    Mapbox.load();
});

Template.search.helpers({
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
Template.search.rendered = function() {
	Session.set("locationsResults", []);

	// If we have already subscribe for places, clear it
	if (resultPlacesSubscription != null)
  		resultPlacesSubscription.stop();

	$('#input-what').focus();

	this.autorun(function () {
		if (Mapbox.loaded()) {
			L.mapbox.accessToken = 'pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			map = L.mapbox.map('map', 'examples.map-i86nkdio')
			.setView([40, -74.50], 9);
			//map.addLayer("placeLayer");
			markerLayerGroup = L.layerGroup([]);
			map.addLayer(markerLayerGroup);
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

	/*var resultPlacesSearchSubscription;
	// Selectize init. for the what input field
	var $selectizeWhat = $('#input-what').selectize({
		valueField: 'text',
		labelField: 'text',
		//searchField: 'text',
		persist: false,
		maxItems: 1,
		create: false,
		render: {
			option: function(item, escape) {
				console.log(item);
				return '<div>' +
					'<span class="title">' +
						'<span class="name">' + escape(item.text) + '</span>' +
					'</span>' +
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			
			Meteor.call('placesByActivities', query, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);
				console.log(result);
				result.slice(0, 10);
				var resultObject = [];
				for (var i = 0; i < result.length; i++) {
					resultObject.push({text: result[i].activities[0]});
				};
				callback(resultObject);
			});
		}
	});*/
}


var resultPlacesSubscription;
Template.search.events({
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
		keywords = Session.get('searchTerms');

		if (location.length < 2)
			return;

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

					// Search the related places in the db
					//Places.find({ "loc": {$within: {$box: [[40.477398999999984, -79.76241799999997], [-71.77749099999998, 45.015864999999984]]}} } )
					var bbox = [[content.features[0].bbox[1], content.features[0].bbox[0]], [content.features[0].bbox[3], content.features[0].bbox[2]]];

					// If we have already subscribe for places, clear it
					if (resultPlacesSubscription != null)
						resultPlacesSubscription.stop();

					var query = '{"text": "' + keywords + '", "bbox": "' + JSON.stringify(bbox) + '"}';
					EasySearch.search('places',  query, function (err, data) {
						if (err) console.log(err);

						console.log(data);
						// use data.results and data.total
						Session.set("searchPlacesResults", data.results);
						setTimeout(function() {
							// Init focus point for the cover and avatars
							$('#search-page #search-results .place .cover').focusPoint();
							$('#search-page #search-results .place .avatar').focusPoint();
						}, 100);

						// Display the results on the map
						for (var i = 0; i < data.results.length; i++) {
							var resource = data.results[i];
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
				};
			}
		});
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
	}
});

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
	console.log(marker);
	marker.bindPopup("<h2>" + resource.name + "</h2>");
}