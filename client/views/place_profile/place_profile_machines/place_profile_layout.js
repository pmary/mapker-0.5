Template.placeProfileMachines.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && Meteor.user()) {
			var isAdmin = Places.findOne({_id: this.place._id, members: { $elemMatch: { id: Meteor.user()._id, admin: true } } });
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
});

Template.placeProfileMachines.events({
	'click .user-action-open-modal-add-machine': function (e, t) {
		// Open the modal
		Session.set('activeModal', 'modalAddMachine');
		$('#myModal').modal();
	}
});
