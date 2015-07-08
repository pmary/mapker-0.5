Template.primaryNavbarNotifications.helpers({
	/**
	 * @summary Get all the notifications of the current user
	 */
	notifs: function() {
		if (Meteor.user())
			return Session.get('notifs');
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
		Session.set( 'notifs', Notifications.find({to: Meteor.user()._id, type: 'notif'}, { sort: { 'createdAt' : -1 }, reactive: false}).fetch() );

		Meteor.call('userMarkNotifsAsRead', function(error, result) {
			if (error) {console.log(error)};
		});
	},
	/**
	 * @summary Prevent the dropdown to close at click on a tab and switch to the
	 * selected tab
	 */
	'click .tab a': function (e, t) {
		// Prevent the notification dropdown to close
		e.stopPropagation();
		e.preventDefault();
		// Toggle the tab
		$(e.currentTarget).tab('show');
	},
	/**
	 * @summary Accept the user connexion request
	 */
	'click .user-action-accept-request': function (e, t) {
		// Prevent the notification dropdown to close
		e.stopPropagation();
		e.preventDefault();

		Meteor.call('userAcceptConnexionRequest', this.id, function (error, result) {
			if (error) return console.log(error);
			console.log(result);
		});
	},
	/**
	 * @summary Deny the request
	 */
	'click .user-action-deny-request': function (e, t) {
		// Prevent the notification dropdown to close
		e.stopPropagation();
		e.preventDefault();

		console.log('deny request');
	}
});
