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

		// Get the user region central point coordinates
		var address = "address=Mont+Cenis&components=country:FR&postal_code:75008";
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'componentRestrictions': { 'postalCode': profile.zipcode }, region: profile.countryCode }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results);
			} else {
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});

		/*Meteor.call('userCreateProfile', profile, function(error, result) {
			// display the error to the user and abort
			if (error) {
				console.log(error);
				return alert(error.reason);
			}

			// Close the modal
			$('#myModal').modal({
				backdrop: true,
		  		keyboard: true
			});
			$('#myModal').modal('hide');
	    });*/
	}
});