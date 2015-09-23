/**
 * @summary Publish all places of the user matchning the given id when he is an administrator
 */
Meteor.publish('userPlaces', function(userId) {
	check(userId, String);

	var user = Meteor.users.findOne({_id: userId}),
	userPlacesIds = [];

	// If the user has places
	if (user && user.profile && user.profile.network && user.profile.network.places) {
		// Get their ids and push them into the table
		for (var i = 0; i < user.profile.network.places.length; i++) {
			userPlacesIds.push(user.profile.network.places[i].id);
		}

		return Places.find({_id: { $in: userPlacesIds }});
	}
	else {
		this.stop();
    return;
	}
});

/**
 * @summary Publish a place by it's id
 */
Meteor.publish('place', function(placeId) {
	check(placeId, String);
	return Places.find({_id: placeId});
});
