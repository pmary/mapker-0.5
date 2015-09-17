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
Meteor.publish("admin_placesToValidate", function () {
	// Check if the user is loged in and has the admin role
	if( Roles.userIsInRole(this.userId, ['admin']) ) {
		 return Places.find({activated: false});
	}
	else {
		this.stop();
    return;
	}
});

/**
 * @summary Publish the complete user document
 */
Meteor.publish("admin_getUser", function (userId) {
	check(userId, String);

	// Check if the user is loged in and has the admin role
	if( Roles.userIsInRole(this.userId, ['admin']) ) {
		 return Meteor.users.find({_id: userId});
	}
	else {
		this.stop();
    return;
	}
});
