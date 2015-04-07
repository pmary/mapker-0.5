/**
 * Meteor publcations
 * @doc: http://docs.meteor.com/#/full/dataandsecurity
 */

// server: publish all room documents
/*Meteor.publish("all-rooms", function () {
  return Rooms.find(); // everything
});*/
// client: start a all-rooms subscription
/*Meteor.subscribe("all-rooms");*/

Meteor.publish('places', function() {
	return Places.find();
});

Meteor.publish('place', function(placeId) {
	check(placeId, String);
	return Places.find({_id: placeId});
});

Meteor.publish("user", function (userId) {
	check(userId, String);
    return Meteor.users.find({_id: userId});
});

Meteor.publish('users', function (userIds) {
	check(userIds, Array);
	return Meteor.users.find({_id: { $in : userIds} });
});

/**
 * Administration publications
 */
Meteor.publish("placesToValidate", function () {
	return Places.find({activated: false});
});