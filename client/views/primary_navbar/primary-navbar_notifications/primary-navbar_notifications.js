Template.primaryNavbarNotifications.helpers({
	/**
	 * @summary Get all the notifications of the current user
	 */
	notifs: function() {
		if (Meteor.user())
			return Session.get('notifs');
	},
	/**
	 * @summary Get all the unread notifications sum
	 */
	notifsCount: function() {
		if (Meteor.user())
			return Notifications.find({to: Meteor.user()._id, read: false}).count();
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

Template.primaryNavbarNotifications.events({
	'click .user-action-open-notifs-list': function(e, t) {
		// Get the user notifications
		Session.set( 'notifs', Notifications.find({to: Meteor.user()._id}, { sort: { 'createdAt' : -1 }, reactive: false}).fetch() );

		Meteor.call('userMaskNotifsAsRead', function(error, result) {
			if (error) {console.log(error)};
		});
	}
});