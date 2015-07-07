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
	},
	/**
	 * @summary Get the last 10 request notifications
	 */
	requests: function () {
		if (Meteor.user()) {
			return Session.get('requests');
		}
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
		// Get the user connexion requests
		//Session.set ('requests', Notifications.find({to: Meteor.user()._id, type: 'request'}, { sort: { 'createdAt' : -1 }, reactive: false}).fetch() )
		var user = Meteor.users.findOne({_id: Meteor.user()._id}, {fields: { 'profile.network.users.pending_reponses': 1, _id: 0 }})
		var requests = user.profile.network.users.pending_reponses;
		console.log(requests);
		Session.set( 'requests', requests );

		Meteor.call('userMaskNotifsAsRead', function(error, result) {
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

		console.log('accept request');
		console.log('this', this);
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
