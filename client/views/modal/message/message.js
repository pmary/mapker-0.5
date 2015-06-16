Template.modalSendMessage.helpers({
	modalMessage: function () {
		return Session.get('modalMessage');
	},
	errorMessage: function (field) {
		return Session.get('modalSendMessage')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalSendMessage')[field] ? 'has-error' : '';
	},
	messageSent: function () {
		return Session.get('messageSent');
	}
});

Template.modalSendMessage.rendered = function () {
	this.autorun(function () {
		
	});
}

Template.modalSendMessage.events({
	'click .user-action-send-message': function (e, t) {
		$('.modal-send-message .user-action-send-message').addClass('btn-loader');

		var message = {
			subject: t.find('#message-subject').value,
			text: t.find('#message-text').value,
			from: Meteor.user()._id,
			to: {
				id: Router.current().params._id,
				resource: 'place'
			}
		}

		var errors = validateMessage(message);
		Session.set('modalSendMessage', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		Meteor.call('sendMessage', message, function (error, result) {
			if (error) {
				$('.modal-send-message .user-action-send-message').removeClass('btn-loader');
				console.log(error);
			}

			Session.set('messageSent', true);
			
			Meteor.setTimeout(function () {
				$('#myModal').modal('hide');
				Session.set('messageSent', false);
			}, 3000);
		});
	}
});