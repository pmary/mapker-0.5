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
		return Places.find();
	}
});

var map;
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
		}
	});
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
				console.log(JSON.parse(result.content));
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
		console.log(t);

		var location = t.find('#input-where').value,
		keywords = t.find('#input-what').value;

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
					
					resultPlacesSubscription = Meteor.subscribe('placesWithinBbox', bbox, {
						onReady: function () {
							//Places.find({ "loc": {$within: {$box: bbox}} });
							$('#search-page #search-results .place .cover').focusPoint();
							$('#search-page #search-results .place .avatar').focusPoint();
						}
					});
				};
			}
		});
	}
});