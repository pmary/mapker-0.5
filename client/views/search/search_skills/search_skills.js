/*****************************************************************************/
/* Local function declaration */
/*****************************************************************************/
/**
 * @summary Find the users that are within the selected location bounding box
 * and one of it's skills match with the given keywords
 * @param {Object} searchObject - Contain the search parameters
 * @param {String} searchObject.keywords - Activities keywords
 * @param {Array} searchObject.bbox - Bounding box coordinates of the selected location bounding box
 */
var searchUsersBySkillsAndBbox = function(searchObject) {
	// Query the ES index via the Meteor method and return the results
	Meteor.call('getUsers', searchObject, function(error, result) {
		if (error) return console.log(error);

		//console.log(result);

		// If there is no result
		if (!result.length) 
			return Session.set('searchUsersResults', "no-result");
		
		// Format the results
		var users = [];
		for (var i = 0; i < result.length; i++) {
			result[i]._source._id = result[i]._id;
			users.push(result[i]._source);
		};

		Session.set('searchUsersResults', users);

		// Init the focus point for the covers
		setTimeout(function() {
			// Init focus point for the cover and avatars
			$('.search-skills #search-results .cover').focusPoint();
		}, 100);
	});
}

/**
 * @summary Prepare the UI and create the search object for the query
 * @fires searchPlacesByActivitiesAndBbox Call the function to query the index, passing the object
 */
var buildAndFiresSearch = function() {
	// Remove the no-search class from #search-container to display the result area
	$('.search-skills#search-container').removeClass('no-search');

	// Get the input values
	var keywords = $('.search-skills #input-skills').val(),
	location = $('.search-skills #input-where').val();

	if (location.length > 2) {
		var query = location.replace(/ /g, "+");
		var queryUrl = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + query + '.json?access_token=pk.eyJ1IjoibWFwa2VyIiwiYSI6IkdhdGxLZUEifQ.J3Et4F0n7-rX2oAQHaf22A';

		// Get the location data
		Meteor.http.get(queryUrl, function (error, result) {
			if (!error) {
				var content = JSON.parse(result.content);
				if (content.features && content.features.length) {
					// bbox = left,bottom,right,top
					var bbox = content.features[0].bbox;
					var searchObject = {queryString: keywords, bbox: bbox};
					searchUsersBySkillsAndBbox(searchObject);
				};
			}
		});
	}
	else {
		// No location, so we search on every users
		var searchObject = {queryString: keywords};
		searchUsersBySkillsAndBbox(searchObject);
	}
}

/*****************************************************************************/
/* Meteor helpers */
/*****************************************************************************/
Template.searchSkills.helpers({
	users: function () {
		return Session.get("searchUsersResults");
	}
});

/*****************************************************************************/
/* Meteor on rendered function */
/*****************************************************************************/
Template.searchSkills.rendered = function() {
	// Set the focus on the what input field
	$('.search-skills #input-skills').focus();

	/**
	 * @summary AutoComplete init. for the skills input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	var currentQueryString;
	$('.search-skills #input-skills').autocomplete({
		position: "absolute",
		appendTo: $('.search-skills #input-what-container'),
		lookup: function(queryString, done) {
			// No search if the query string lenght < 2 characters
			// Or if the input text hasn't change
			if (queryString.length < 2 || queryString == currentQueryString) return;
			currentQueryString = queryString;

			// Search users matching with the current input values
			buildAndFiresSearch();
			
			// Get the suggestions according to the queryString
			Meteor.call('getSkillsSuggestions', queryString, function(error, result) {
				// Display the error to the user and abort
				if (error) return console.log(error.reason);

				formatedResult = {
					suggestions: $.map(result, function(dataItem) {
						return { value: dataItem.text, data: dataItem.text };
					})
				};

				done(formatedResult);
			});
		},
		onSelect: function (suggestion) {
			console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
			// Search users matching with the current input values
			buildAndFiresSearch();
		}
	});
 
	/**
	 * @summary AutoComplete init. for the location input field
	 * @see https://github.com/devbridge/jQuery-Autocomplete
	 * @see https://www.devbridge.com/sourcery/components/jquery-autocomplete/
	 */
	var currentLocationQueryString;
	$('.search-skills #input-where').autocomplete({
		position: "absolute",
		appendTo: $('.search-skills #input-where-container'),
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
						var results = content.features.slice(0, 10);
						
						var formatedResult = {
							suggestions: $.map(results, function(dataItem) {
								return { value: dataItem.place_name, data: dataItem.place_name };
							})
						};

						done(formatedResult);
					};
				}
			});
		},
		onSelect: function (suggestion) {
			console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
			// Search users matching with the current input values
			buildAndFiresSearch();
		}
	});
}

Template.searchSkills.events({
	'submit #search-form': function(e,t) {
		e.preventDefault();

		// Search users matching with the current input values
		buildAndFiresSearch();
	}
});