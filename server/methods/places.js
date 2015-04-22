/**
 * Serveur side methods for the Places collection
 */
Meteor.methods({
	/**
	 * @summary Return the all the activities labels matching with the given string from database
	 * @param {String} [queryString] The value of the search input field
	 * @return {Array}
	 */
	placesAutocompleteByActivities: function(queryString) {
		check(queryString, String);
		var selector = { 'activities': { '$regex': queryString, '$options': 'i' } };
		var options = { fields: { 'activities': {'$elemMatch': { '$regex': queryString, '$options': 'i' }}, '_id':0 } };
		var activities = Places.find( selector, options ).fetch();
		return activities;
	},
	placesByActivityAndBbox: function(searchObject) {
		check(searchObject, {
			queryString: String,
			bbox: Array
		});
		var selector = { $and: [
			{ 'activities': searchObject.queryString },
			{ "loc": {$within: {$box: searchObject.bbox}} }
		]};
		var options = { fields: { 'activities': 1, 'name': 1, 'avatar': 1, 'cover': 1, 'loc': 1 } };
		var places = Places.find( selector, options ).fetch();
		return places;
	},
	resourcesAutocomplete: function(queryString) {
		check(queryString, String);
		var selector = {'name': { '$regex': queryString, '$options': 'i' } };
		var options = { fields: { 'name': 1, 'avatar': 1 }, limit: 10 };
		var resources = Places.find( selector, options ).fetch();
		return resources;
	}
});