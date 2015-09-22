Template.createPlace.events({
	'click .user-action-open-modal-add-place' : function (e, t) {
		// Check if the user is loged in
		if (Meteor.user()) {
			Modal.show('modalCreatePlace');
		}
		else {
			// Open the 'login required' modal
			Modal.show('modalLoginRequired');
		}
	}
});
