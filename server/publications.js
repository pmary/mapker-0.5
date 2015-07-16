/**
 * Meteor publcations
 * @doc: http://docs.meteor.com/#/full/dataandsecurity
 */

/*****************************************************************************/
/* Public Places publications */
/*****************************************************************************/

/*****************************************************************************/
/* Public Users publications */
/*****************************************************************************/
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

/**
 * @summary Publish a user document by it's id
 */
Meteor.publish("user", function (userId) {
	check(userId, String);
    return Meteor.users.find({_id: userId});
});

/**
 * @summary Publish users documents following the given array of ids
 * @param {Array} userIds - An array of user ids
 */
Meteor.publish('users', function (userIds) {
	check(userIds, Array);
	return Meteor.users.find({_id: { $in : userIds} }, {fields: {emails: 0, services: 0, createdAt: 0}});
});

/*****************************************************************************/
/* Public Notifications publications */
/*****************************************************************************/
/**
 * @summary Publish all the notifications of an user
 */
Meteor.publish('pubUserNotifs', function(userId) {
	check(userId, String);
	return Notifications.find({to: userId}, {reactive: false});
});

/*****************************************************************************/
/* Admin Places publications */
/*****************************************************************************/
/**
 * @summary Publish all the places waiting for validation
 */
Meteor.publish("placesToValidate", function () {
	return Places.find({activated: false});
});

/*****************************************************************************/
/* Admin Users publications */
/*****************************************************************************/
/**
 * @summary Publish all the users fullname
 */
Meteor.publish("allUsers", function() {
	return Meteor.users.find({}, { fields: { 'profile.fullname': 1}});
})
