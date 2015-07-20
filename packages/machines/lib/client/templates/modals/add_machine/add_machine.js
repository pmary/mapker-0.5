Template.modalAddMachine.helpers({
	errorMessage: function(field) {
		return Session.get('modalAddPlaceErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalAddPlaceErrors')[field] ? 'has-error' : '';
	}
});

Template.modalAddMachine.rendered = function () {
	$('.modal-place-add-machine [data-toggle="popover"]').popover();

	// Init the tags input
	//$('input#input-activities').tagsinput('destroy');
	//$("input#input-activities").tagsinput('items');

	/*$('select#select-types').selectize({
		maxItems: 3
	});

	$('select#select-specialities').selectize({
		maxItems: 5
	});*/
};

Template.modalAddMachine.events({
  'submit .add-machine-form': function (e, t) {
    console.log('submit');
  }
});
