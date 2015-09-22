Template.createCommunity.events({
	'click .user-action-open-modal-add-community' : function (e, t) {
		// Check if the user is loged in
		if (Meteor.user()) {
			Modal.show('modalCreateCommunity');
		}
		else {
			// Open the 'login required' modal
			Modal.show('modalLoginRequired');
		}
	}
});
