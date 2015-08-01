Template.userProfilePlaces.rendered = function() {
	this.autorun(function () {
		console.log(this);
		//Meteor.subscribe('place', this.params._id);
	});
}

Template.userProfilePlaces.events({
	'click .open-modal-add-place' : function (e, t) {
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});

		// Open the add place modal
		Session.set('activeModal', 'modalAddPlace');
		$('#myModal').modal();
	}
});
