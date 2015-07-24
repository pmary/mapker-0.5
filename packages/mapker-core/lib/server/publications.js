/**
 * @summary Publish all the users fullname
 */
Meteor.publish("allUsers", function() {
	return Meteor.users.find({}, { fields: { 'profile.fullname': 1}});
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
