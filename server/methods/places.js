/**
 * Serveur side methods for the Places collection
 */
Meteor.methods({
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