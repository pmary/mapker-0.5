/**
 * Serveur side methods 
 */
Meteor.methods({
	placesByActivities: function(queryString) {
		check(queryString, String);
		var selector = { 'activities': { '$regex': queryString, '$options': 'i' } };
		var options = { fields: { 'activities': {'$elemMatch': { '$regex': queryString, '$options': 'i' }}, '_id':0 } };
		var activities = Places.find( selector, options ).fetch();
		return activities;
	},
	resourcesAutocomplete: function(queryString) {
		check(queryString, String);
		var selector = {'name': { '$regex': queryString, '$options': 'i' } };
		var options = { fields: { 'activities': 1, 'name': 1, 'avatar': 1 }, limit: 10 };
		var resources = Places.find( selector, options ).fetch();
		return resources;
	}
});