/*****************************************************************************/
/* Local function declaration */
/*****************************************************************************/
var filters = {}; // The last argument passed to searchSkillsByActivitiesAndBbox()
var areasLayers = [];
var resultPerPage = 1; // The max number of results to display per page
var resultsFrom = 0; // From which result do we want to get the places (used for pagination)
var currentPage = 1; // The current search result page

/**
 * @summary Find the places that are within the current map viewable zone and that one
 * of it's activities match with the given keywords
 * @param {Object} searchObject - Contain the search parameters
 * @param {String} searchObject.keywords - Activities keywords
 * @param {Array} searchObject.bbox - Bounding box coordinates of the current map focus
 */
var searchSkillsByActivitiesAndBbox = function(searchObject) {
	// Query the ES index via the Meteor method and return the results
	//console.log(searchObject);
	Meteor.call('getUsers', searchObject, function(error, result) {
		if (error) {
      throw error;
    }

		//console.log(result);

		// If there is no result
		if (!result.hits.total) {
			$('.search-results-container').removeClass('scrollable');
			return Session.set('searchSkillsResults', "no-result");
		}

		// Format the results
		var places = [];
		for (var i = 0; i < result.hits.hits.length; i++) {
			result.hits.hits[i]._source._id = result.hits.hits[i]._id;
			places.push(result.hits.hits[i]._source);
		}

		Session.set('searchSkillsResults', places);

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

			// Check if the sear-result has a scroll
			Meteor.setTimeout(function () {
				var element = $('.search-results-container');

				if ($('.search-results-container .search-results .search-results-inner').prop('scrollHeight') > $('.mapker-search-places').height()) {
					element.addClass('scrollable');
				}
				else {
					element.removeClass('scrollable');
				}
			}, 500);
		}

		// Setup the pagination
		if (result.hits.total > resultPerPage) {
			var nbrOfPages = Math.ceil(result.hits.total / resultPerPage),
			pagination = { pages: [] };

			for (var z = 0; z < nbrOfPages; z++) {
				if (z === 0) {
					pagination.pages.push({index: (z+1), active: true});
				}
				else {
					pagination.pages.push({index: (z+1), active: false});
				}
			}

			// Check if we need to display the 'Previous' or 'Next' buttons
			if ( (+currentPage) === 1 ) {
				pagination.position = 'first';
			}
			else if (pagination.pages.length === (+currentPage)) {
				pagination.position = 'last';
			}

			Session.set('pagination', pagination);
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
 * @fires searchSkillsByActivitiesAndBbox Call the function to query the index, passing the object
 */
var buildAndFiresSearch = function() {
	var searchObject = { filters: {} };

	// Add the type filters if set
	if (filters.types) {
		searchObject.filters.types = filters.types;
	}
	else {
		searchObject.filters.types = [];
	}

	 if (filters.specializations) {
		 searchObject.filters.specializations = filters.specializations;
	 }
	 else {
		 searchObject.filters.specializations = [];
	 }

	// Remove the no-search class from #search-container to display the result area
	$('.mapker-search-skills .search-place').removeClass('no-search');

	// Clear map
	clearMap();
	// Reset the marker list
	markers = [];
	// Reset the search results
	Session.set('searchSkillsResults', '');

	// Get the input values
	var location = $('.mapker-search-skills #mapker-places-input-where').val(),
	keywords = $('.mapker-search-skills #mapker-places-input-what').val();
	if (location.length > 2) {
		var query = location.replace(/ /g, "+");
		// Mapbox geocoding. See https://www.mapbox.com/developers/api/geocoding/
		var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

		// Get the location data
		Meteor.http.get(queryUrl, function (error, result) {
			if (!error) {
				var content = JSON.parse(result.content);
				console.log('content', content);
				if (content.features && content.features.length) {
					// bbox = left,bottom,right,top
					var bbox = content.features[0].bbox;

					// Center the map on the given bounding box
					var southWest = L.latLng(content.features[0].bbox[1], content.features[0].bbox[0]),
					northEast = L.latLng(content.features[0].bbox[3], content.features[0].bbox[2]),
					bounds = L.latLngBounds(southWest, northEast);
					map.fitBounds([bounds], {paddingTopLeft: [750, 0]});

					searchObject.queryString = keywords;
					searchObject.bbox = bbox;

					/*var boundingBox = L.rectangle(bounds, {color: "#ff7800", weight: 1});

					map.removeLayer(boundingBox);
					map.addLayer(boundingBox);*/

					// Get the polygon of the search area
					// @see http://wiki.openstreetmap.org/wiki/Nominatim#Usage_Policy
					// @see http://open.mapquestapi.com/nominatim/
					Meteor.http.get('http://open.mapquestapi.com/nominatim/v1/search.php?q=' + query + '&format=json&limit=1&polygon_geojson=1&key=RW6FCHP6d4oA0U5osEPiBhU2VhNhc1Ge', function (error, result) {
						if (error) {
							console.log(error);
							return false;
						}

						if (result.statusCode === 200) {
							var content = JSON.parse(result.content);
							console.log('content', content);

							// Ckeck if we get the MultiPolygon coordinates
							if (
								content &&
								content[0] &&
								//content[0].class === 'boundary' &&
								content[0].geojson &&
								content[0].geojson.coordinates &&
								content[0].geojson.coordinates[0]
							) {
								console.log('content[0].geojson.coordinates', content[0].geojson.coordinates);

								// Clear the area layers
								for (var b = 0; b < areasLayers.length; b++) {
									map.removeLayer(areasLayers[b]);
								}

								areasLayers.push(L.geoJson(content[0].geojson, { color: '#1ABDA4' }).addTo(map));
							}
						}
					});

					searchSkillsByActivitiesAndBbox(searchObject);
				}
			}
		});
	}
	else {
		// See https://www.mapbox.com/mapbox.js/api/v2.1.9/l-latlngbounds/
		var left = map.getBounds().getWest(),
		bottom = map.getBounds().getSouth(),
		right = map.getBounds().getEast(),
		top = map.getBounds().getNorth(),
		bbox = [ left, bottom, right, top ];
		//console.log(bbox);

		searchObject.queryString = keywords;
		searchObject.bbox = bbox;

		searchSkillsByActivitiesAndBbox(searchObject);
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
/* Meteor helpers */
/*****************************************************************************/
Template.searchSkills.helpers({
	places: function () {
		return Session.get("searchSkillsResults");
	}
});


/*****************************************************************************/
/* Meteor on rendered function */
/*****************************************************************************/
var map, markerLayerGroup;
var markers = []; // Our marker list
Template.searchSkills.rendered = function() {
	// Clear the session var to prevent displaying results from an old search
	Session.set("searchSkillsResults", []);

	// Set the focus on the what input field
	$('.mapker-search-skills #mapker-places-input-what').focus();

	this.autorun(function () {
		// Set the menu item as active
		$('#primary-navbar #main-menu li').removeClass('active');
		$('#primary-navbar #main-menu #menu-item-skills').addClass('active');

		if (Mapbox.loaded()) {
			L.mapbox.accessToken = 'pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';
			// Return if Map is already initialized
			map = L.mapbox.map('mapker-places-search-map', 'mapbox.streets', {zoomControl: false})
			.setView([40, -20.50], 3);
			//map.addLayer("placeLayer");

			// Disable touch and whell zoom
			map.touchZoom.disable();
			map.scrollWheelZoom.disable();

			// Set the zoom controls at the bottom right
			new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

			markerLayerGroup = L.layerGroup([]);
			map.addLayer(markerLayerGroup);

			// Launch a search by default
			buildAndFiresSearch();
		}
	});

	/**
	 * @summary AutoComplete init. for the skills input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	var currentWhatQueryString;
	$('.mapker-search-skills #mapker-places-input-what').autocomplete({
		position: "absolute",
		appendTo: $('.mapker-search-skills .input-what-container'),
		lookup: function(queryString, done) {
			// No search if the query string lenght < 2 characters
			// Or if the input text hasn't change
			if (queryString.length < 2 || queryString == currentWhatQueryString) return;
			currentWhatQueryString = queryString;

			// Search places matching with the current input values
			buildAndFiresSearch();

			// Get the suggestions according to the queryString
			Meteor.call('getSkillsSuggestions', queryString, function(error, result) {
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
	$('.mapker-search-skills #mapker-places-input-where').autocomplete({
		position: "absolute",
		appendTo: $('.mapker-search-skills .input-where-container'),
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
						console.log(content.features);
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
Template.searchSkills.events({
	'submit #mapker-places-search-form': function(e,t) {
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
		var resourceId = e.currentTarget.dataset.id,
		zipcode = e.currentTarget.dataset.zipcode,
		country = e.currentTarget.dataset.country,
		city = e.currentTarget.dataset.city;

		Meteor.http.get('http://open.mapquestapi.com/nominatim/v1/search.php?city=' + city + '&countrycodes=' + country + '&format=json&limit=1&polygon_geojson=1&key=RW6FCHP6d4oA0U5osEPiBhU2VhNhc1Ge', function (error, result) {
			if (error) {
				console.log(error);
				return false;
			}

			if (result.statusCode === 200) {
				var content = JSON.parse(result.content);

				// Ckeck if we get the MultiPolygon coordinates
				if (
					content &&
					content[0] &&
					//content[0].class === 'boundary' &&
					content[0].geojson &&
					content[0].geojson.coordinates &&
					content[0].geojson.coordinates[0]
				) {
					//console.log('content[0].geojson.coordinates', content[0].geojson.coordinates);

					// Clear the area layers
					for (var b = 0; b < areasLayers.length; b++) {
						map.removeLayer(areasLayers[b]);
					}

					areasLayers.push(L.geoJson(content[0].geojson, { color: '#1ABDA4' }).addTo(map));
				}
			}
		});

		for (var i = 0; i < markers.length; i++) {
			if(markers[i].options._id == resourceId) {
				map.setView(markers[i].getLatLng(), 13);
				map.panBy([-350, 0]);
				markers[i]._icon.firstElementChild.className = "pin pin-place-hover";
				//markers[i].openPopup();
			}
		}
	},
	/**
   * @summary Add a Type filter to the search
	 * @fires buildAndFiresSearch
	 */
	'click .filters .types li': function (e) {
		var filterId = e.target.dataset.id;

		// If their is no filter.type array, create it
		if (! filters.types) {
			filters.types = [];
		}

		// Check if the filter already have the 'active' class
		if ( $(e.target).hasClass('active') ) {
			// Remove it
			$(e.target).removeClass('active');
			// Remove the filter from the searchObject
			filters.types.splice(filters.types.indexOf(filterId), 1);
		}
		else {
			// Add it
			$(e.target).addClass('active');
			// Add the filter to the searchObject
			if (filterId) {
				filters.types.push(filterId);
			}
		}

		buildAndFiresSearch();
	},
	/**
   * @summary Add a Specialization filter to the search
	 * @fires buildAndFiresSearch
	 */
	'click .filters .specializations li': function (e) {
		var filterId = e.target.dataset.id;

		// If their is no filter.specializations array, create it
		if (! filters.specializations) {
			filters.specializations = [];
		}

		// Check if the filter already have the 'active' class
		if ( $(e.target).hasClass('active') ) {
			// Remove it
			$(e.target).removeClass('active');
			// Remove the filter from the searchObject
			filters.specializations.splice(filters.specializations.indexOf(filterId), 1);
		}
		else {
			// Add it
			$(e.target).addClass('active');
			// Add the filter to the searchObject
			if (filterId) {
				filters.specializations.push(filterId);
			}
		}

		buildAndFiresSearch();
	},
	/**
	 * @summary Go to the given result page
	 */
	'click .user-action-go-to-page': function (e, t) {
		var pagination = Session.get('pagination');

		// Check if the selected page is the current one
		if (currentPage === (+e.currentTarget.dataset.index)) {
			// No need to redirect, the user is already on the asked page
			return false;
		}

		currentPage = (+e.currentTarget.dataset.index);

		var index = ((+e.currentTarget.dataset.index)  - 1);

		if (index) {
			resultsFrom = (index * resultPerPage);
		}
		else {
			resultsFrom = 0;
		}

		// Set the selected page as active
		for (var i = 0; i < pagination.pages.length; i++) {
			pagination.pages[i].active = false;
			if(i === index) {
				pagination.pages[i].active = true;
			}
		}

		// If the selected page is the last one, set thepagination position at 'last'
		if (currentPage === pagination.pages.length) {
			pagination.position = 'last';
		}
		Session.set('pagination', pagination);

		buildAndFiresSearch();
	},
	/**
	 * @summary Go to the first page
	 */
	'click .user-action-go-to-first-page': function () {
		currentPage = 1;
		resultsFrom = 0;

		var pagination = Session.get('pagination');
		// Set the first page as active
		for (var i = 0; i < pagination.pages.length; i++) {
			pagination.pages[i].active = false;
			if(i === 0) {
				pagination.pages[i].active = true;
			}
		}
		pagination.position = 'first';
		Session.set('pagination', pagination);

		buildAndFiresSearch();
	},
	/**
	 * @summary Go to the last page
	 */
	'click .user-action-go-to-last-page': function () {
		// Get the number of pages
		var pagination = Session.get('pagination');
		currentPage = pagination.pages.length;
		resultsFrom = ((currentPage -1) * resultPerPage);

		// Set the last page as active
		for (var i = 0; i < pagination.pages.length; i++) {
			pagination.pages[i].active = false;
			if(i === (currentPage - 1)) {
				pagination.pages[i].active = true;
			}
		}
		pagination.position = 'last';
		Session.set('pagination', pagination);

		buildAndFiresSearch();
	}
});
