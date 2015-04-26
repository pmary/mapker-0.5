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
		var options = { fields: { 'activities': {'$elemMatch': { '$regex': queryString, '$options': 'i' }}, '_id':0 }, limit: 10 };
		var activities = Places.find( selector, options ).fetch();
		return activities;
	},
	placesByActivitiesAndBbox: function(searchObject) {
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
		
		var placeSelector = {'name': { '$regex': queryString, '$options': 'i' } };
		var placeOptions = { fields: { 'name': 1, 'avatar': 1 }, limit: 10 };
		var places = Places.find( placeSelector, placeOptions ).fetch();
		for (var i = 0; i < places.length; i++) {
			places[i].type = 'place';
		};

		var userSelector = {'profile.fullname': { '$regex': queryString, '$options': 'i' } };
		var userOptions = { fields: { 'profile.fullname': 1, 'profile.avatar': 1 }, limit: 10 };
		var users = Meteor.users.find( userSelector, userOptions).fetch();

		for (var i = 0; i < users.length; i++) {
			users[i].name = users[i].profile.fullname;
			users[i].avatar = users[i].profile.avatar;
			users[i].type = 'user';
		};
		
		var resources = places.concat(users);

		return resources;
	}
});