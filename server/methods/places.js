/**
 * Serveur side methods for the Places collection
 */
Meteor.methods({
	/**
	 * @summary Return the all the activities labels matching with the given string from database
	 * @param {String} [queryString] The value of the search input field
	 * @return {Array}
	 */
	placesByActivities: function(queryString) {
		check(queryString, String);
		var selector = { 'activities': { '$regex': queryString, '$options': 'i' } };
		var options = { fields: { 'activities': {'$elemMatch': { '$regex': queryString, '$options': 'i' }}, '_id':0 } };
		var activities = Places.find( selector, options ).fetch();
		return activities;
	}
});