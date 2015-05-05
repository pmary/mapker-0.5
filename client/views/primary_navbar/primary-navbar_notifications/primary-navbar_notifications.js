Template.primaryNavbarNotifications.rendered = function(argument) {
	this.autorun(function () {
		if (Meteor.user()) {
			// Subscribe to the user notification
			Meteor.subscribe('pubUserNotifs', Meteor.user());
		}
	});
}