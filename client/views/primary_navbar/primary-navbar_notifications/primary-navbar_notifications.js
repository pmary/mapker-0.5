Template.primaryNavbarNotifications.helpers({
	/**
	 * @summary Get all the notifications of the current user
	 */
	notifs: function() {
		if (Meteor.user())
			return Notifications.find({userId: Meteor.user()._id}, { sort: { 'createdAt' : -1 }});
	}
});

Template.primaryNavbarNotifications.rendered = function(argument) {
	this.autorun(function () {
		if (Meteor.user()) {
			// Subscribe to the user notification
			Meteor.subscribe('pubUserNotifs', Meteor.user()._id);
		}
	});
}