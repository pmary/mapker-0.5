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

Meteor.publish("user", function (userId) {
	check(userId, String);
    return Meteor.users.find({_id: userId});
});