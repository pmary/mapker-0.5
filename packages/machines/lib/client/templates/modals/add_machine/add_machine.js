Template.modalAddMachine.helpers({
	errorMessage: function(field) {
		return Session.get('modalAddPlaceErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalAddPlaceErrors')[field] ? 'has-error' : '';
	},
	machinesTypes: function () {
		return Taxons.find({collection: 'machines', category: 'type'}).fetch();
	},
	machinesBrands: function () {
		return Taxons.find({collection: 'machines', category: 'brand'}).fetch();
	},
	machinesWorkshop: function () {
		return Taxons.find({collection: 'machines', category: 'workshop'}).fetch();
	}
});

Template.modalAddMachine.rendered = function () {
	$('.modal-place-add-machine [data-toggle="popover"]').popover();

	Meteor.subscribe('machinesTaxons');
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
  'submit .add-machine-form, click .user-action-send-invitations': function (e, t) {
		console.log('submit .add-machine-form');
		console.log(t.find('#select-type'));
		var machine = {
			name		: t.find('#input-name').value,
			type		: t.find('#select-type').value,
			brand		: t.find('#select-brand').value,
			workshop: t.find('#select-workshop').value,
			width		: t.find('#input-width').value,
			length	: t.find('#input-length').value,
			height	: t.find('#input-height').value,
		};

		// Validate the form
		console.log('machine', machine);
		var errors = Machines.addFormValidation(machine);
		Session.set('modalAddPlaceErrors', errors);
		if (Object.keys(errors).length) {
			return; // Abort the account creation due to errors
		}
  }
});
