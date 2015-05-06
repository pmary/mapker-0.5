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
	Meteor.call('getUsers', searchObject, function(error, result) {
		if (error)
			console.log(error);

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

/*****************************************************************************/
/* Meteor helpers */
/*****************************************************************************/
Template.searchSkills.helpers({
	/*searchTerms: function () {
		return Session.get('searchTerms');
	},
	locationsResults: function () {
		return Session.get("locationsResults");
	},*/
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

			// Search places matching with the what input value
			/*var searchObject = {queryString: queryString};
			searchPlacesByActivitiesAndBbox(searchObject);*/
			
			// Get the suggestions according to the queryString
			console.log("will getSkillsSuggestions");
			Meteor.call('getSkillsSuggestions', queryString, function(error, result) {
				console.log(error);
				console.log(result);
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
		}
	});
 
	/**
	 * @summary Selectize init. for the where input field
	 * @see https://github.com/brianreavis/selectize.js/blob/master/docs/usage.md
	 * @see https://github.com/brianreavis/selectize.js/blob/master/docs/api.md
	 */
	var whereInputText = "";
	$searchWhere = $('.search-skills #input-where').selectize({
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
			//console.log('load');
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
		onType: function(str) { whereInputText = str; },
		onFocus: function() { 
			searchWhere.clear(); 
			$('.search-skills #input-where-container .selectize-input input').val(whereInputText);
		}
	});
	searchWhere = $searchWhere[0].selectize;
}

Template.searchSkills.events({
	'submit #search-form': function(e,t) {
		e.preventDefault();

		// Remove the no-search class from #search-container to display the result area
		$(t.find('#search-container')).removeClass('no-search');

		// Get the input values
		var keywords = t.find('#input-skills').value,
		location = t.find('#input-where').value;

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
});