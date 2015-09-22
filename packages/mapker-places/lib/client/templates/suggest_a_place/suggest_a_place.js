Template.suggestPlace.events({
	'click .user-action-open-modal-suggest-place' : function (e, t) {
		// Reset the static map url and the form errors
		/*Session.set('staticMapUrl', "");
		Session.set('modalSuggestPlaceErrors', {});

		// Open the add place modal
		Session.set('activeModal', 'modalSuggestPlace');
		Meteor.setTimeout(function () {
			$('.modal-suggest-place #submit-place').css('display',"none");
			$('.modal-suggest-place #check-location').css('display',"inline-block");
		}, 500);
		$('#myModal').modal();*/

		// Check if the user is loged in
		if (Meteor.user()) {
			Modal.show('modalSuggestPlace');
		}
		else {
			// Open the 'login required' modal
			Modal.show('modalLoginRequired');
		}
	}
});
