Template.suggestPlace.events({
	'click .user-action-open-modal-suggest-place' : function (e, t) {
		// Reset the static map url and the form errors
		Session.set('staticMapUrl', "");
		Session.set('modalSuggestPlaceErrors', {});

		// Open the add place modal
		Session.set('activeModal', 'modalSuggestPlace');
		$('#myModal').modal();
	}
});
