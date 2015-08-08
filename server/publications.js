/**
 * Meteor publcations
 * @doc: http://docs.meteor.com/#/full/dataandsecurity
 */
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
