/**
 * @summary Publish all places of the user matchning the given id when he is an administrator
 */
Meteor.publish('userPlaces', function(userId) {
	check(userId, String);
	return Places.find({administrators: userId});
});

/**
 * @summary Publish a place by it's id
 */
Meteor.publish('place', function(placeId) {
	check(placeId, String);
	return Places.find({_id: placeId});
});
