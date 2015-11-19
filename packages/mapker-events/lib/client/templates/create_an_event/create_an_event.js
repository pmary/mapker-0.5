Template.createEvent.events({
	'click .user-action-open-modal-add-event' : function (e, t) {
		// Check if the user is loged in
		if (Meteor.user()) {
			Modal.show('modalCreateEvent');
		}
		else {
			// Open the 'login required' modal
			Modal.show('modalLoginRequired');
		}
	}
});
