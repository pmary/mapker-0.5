Template.userProfilePlaces.helpers({
	hasPlaces: function(field) {
		return Places.find().count();
	}
});

Template.userProfilePlaces.rendered = function() {
	this.autorun(function () {
		var places = Places.find().count();

		if (places) {
			$('.user-profile-places .validation-in-progess').popover();
		}
	});
};

Template.userProfilePlaces.onDestroyed(function () {
	$('.user-profile-places .validation-in-progess').popover('destroy');
});

Template.userProfilePlaces.events({
	'click .open-modal-add-place' : function (e, t) {
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalAddPlaceErrors', {});

		// Open the add place modal
		Session.set('activeModal', 'modalAddPlace');
		$('#myModal').modal();
	},
	'click .user-go-create-place': function () {
		Router.go('createPlace');
	}
});
