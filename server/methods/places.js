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
	}
});