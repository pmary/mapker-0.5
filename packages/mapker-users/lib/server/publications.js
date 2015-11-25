/**
 * @summary Publish a user document by it's id
 */
Meteor.publish("user", function (userId) {
	check(userId, String);
    return Meteor.users.find({_id: userId});
});

/**
 * @summary Publish the user network
 * @param {String} userId
 */
Meteor.publish("userNetwork", function (userId) {
	check(userId, String);

  var user = Meteor.users.findOne({_id: userId});

  // If the user has a network
  if ( user && user.profile.network && user.profile.network.users && user.profile.network.users.connected ) {
    return Meteor.users.find({_id: { $in: user.profile.network.users.connected}}, { fields: {profile: 1}, reactive: false});
  }
  else {
    return;
  }
});

Meteor.publish('userCommunities', function (userId) {
	check(userId, String);

	var user = Meteor.users.findOne({_id: userId});

	// If the user has, at least, a community
  if (
		user &&
		user.profile.network &&
		user.profile.network.communities &&
		user.profile.network.communities.length
	) {
		// Get the ids of the user communities
		var communities = [];
		for (var i = 0; i < user.profile.network.communities.length; i++) {
			communities.push(user.profile.network.communities[i].id);
		}

    return Communities.find({_id: { $in: communities}}, { fields: {}, reactive: false});
  }
  else {
    return;
  }
});

Meteor.publish('userEvents', function (userId) {
	check(userId, String);

	var user = Meteor.users.findOne({_id: userId});

	// If the user has, at least, an event
  if (
		user &&
		user.profile &&
		user.profile.events &&
		user.profile.events.length
	) {
		// Get the ids of the user events
		var events = [];
		for (var i = 0; i < user.profile.events.length; i++) {
			events.push(user.profile.events[i].id);
		}

    return Events.find({_id: { $in: events}}, { fields: {}, reactive: false});
  }
  else {
    return;
  }
});

/**
 * @summary Publish users documents following the given array of ids
 * @param {Array} userIds - An array of user ids
 */
Meteor.publish('users', function (userIds) {
	check(userIds, Array);
	return Meteor.users.find({_id: { $in : userIds} }, {fields: {emails: 0, services: 0, createdAt: 0}});
});
