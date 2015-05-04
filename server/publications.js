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

Meteor.publish('placesByName', function(selector, options) {
	console.log(selector);
	check(arguments, Object);
	check(options, Object);
	Autocomplete.publishCursor( Places.find(selector, options), this);
	this.ready();
});

Meteor.publish('placesByActivities', function(selector, options) {
	/*console.log(selector);
	console.log(options);*/
	//console.log("{ activities: { '$regex': "+selector.activities.$regex+", '$options': 'i' } }, { activities: {$elemMatch: { '$regex': "+selector.activities.$regex+", '$options': 'i' }}, _id:0 }");

	return Places.find( { activities: { '$regex': 'aero', '$options': 'i' } },  { activities: {$elemMatch: { '$regex': 'aero', '$options': 'i' }}, _id:0 } );
});

// Return all places where the given user is admin
Meteor.publish('userPlaces', function(userId) {
	check(userId, String);
	return Places.find({administrators: userId});
});

Meteor.publish('place', function(placeId) {
	check(placeId, String);
	return Places.find({_id: placeId});
});

// Return all the place that are located in the given bounding box
Meteor.publish('placesWithinBbox', function(bbox) {
	check(bbox, Array);
	return Places.find({ "loc": {$within: {$box: bbox}} });
});

// Return a user data following the given id
Meteor.publish("user", function (userId) {
	check(userId, String);
    return Meteor.users.find({_id: userId});
});

// Return many users data following the giver array of ids
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

Meteor.publish("allUsers", function() {
	return Meteor.users.find({}, { fields: { 'profile.fullname': 1}});
})