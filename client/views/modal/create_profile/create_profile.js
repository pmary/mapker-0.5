Template.modalCreateProfile.created = function() {
}

Template.modalCreateProfile.rendered = function() {
	$('.modal-create-profile [data-toggle="popover"]').popover();

	// Init the tags input
	/*$("input#input-themes").tagsinput('items');
	$("input#input-activities").tagsinput('items');*/
}

Template.modalCreateProfile.helpers({
	errorMessage: function(field) {
		return Session.get('modalCreateProfileErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalCreateProfileErrors')[field] ? 'has-error' : '';
	}
});

Template.modalCreateProfile.events({
	'submit #create-profile-form' : function(e, t){
		e.preventDefault();
		console.log("Create a new profile");

		var profile = {
			activity: t.find('#input-activity').value,
			countryCode: t.find('#select-country').value,
			zipcode: t.find('#input-zipcode').value
		};

		var errors = validateAddProfile(profile);
		console.log(errors);
		Session.set('modalCreateProfileErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		Meteor.call('userCreateProfile', profile, function(error, result) {
			// display the error to the user and abort
			if (error) {
				console.log(error);
				return alert(error.reason);
			}
			//Router.go('postPage', {_id: result._id});
			//console.log("Profile successufully created");
			//console.log(result);

			// Close the modal
			$('#myModal').modal({
				backdrop: true,
		  		keyboard: true
			});
			$('#myModal').modal('hide');
	    });
	}
});