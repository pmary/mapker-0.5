Template.placeProfileLayout.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && this.place.administrators.indexOf(Meteor.user()._id) > -1)
			return true;
		else
			return false;
	}
});

Template.placeProfileLayout.onRendered = function(){

};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	var resource = {
		id: t.data.place._id, // User id
		cover: t.data.place.cover,
		logo: t.data.place.avatar,
		type: 'place'
	}
	Session.set('modalResource', resource);
}

Template.placeProfileLayout.events({
	/*****************************************************************************/
	/* Inner navigation UI */
	/*****************************************************************************/
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/*****************************************************************************/
	/* Avatar and cover update UI */
	/*****************************************************************************/
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	'click #upload-avatar-btn': function(e, t) { console.log(t);
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		setModalData(t);

		// Init focuspoint
		$('#helper-tool-container').jQueryFocuspointHelpertool();
	},
	/*****************************************************************************/
	/* Identity edition UI */
	/*****************************************************************************/
	'click #identity-edit' : function(e,t) {
		if (t.find('#resource-infos-identity .popover')) {
			// Render the identity edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.placeProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateIdentityErrors', {});
			// Init the popover with empty content
			$(t.find('#identity-edit')).popover({html: true, content: " "});
			// Show the popover
			$(t.find('#identity-edit')).popover('show');
			// Render the placeProfileIdentityEdition template in the popover with the current template data
			Blaze.renderWithData(Template.placeProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
		}
	},
	/*****************************************************************************/
	/* Social profiles UI */
	/*****************************************************************************/
	'click #add-social-profiles, click #edit-social-profiles' : function(e,t) {
		if (t.find('#resource-infos-social-profiles .popover')) {
			// Render the social profiles edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.placeUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('placeUpdateSocialProfilesErrors', {});
			// Init the popover with empty content
			$(t.find('#social-profiles')).popover({html: true, content: " "});
			// Show the popover
			$(t.find('#social-profiles')).popover('show');
			// Render the placeUpdateSocialProfiles template in the popover with the current template data
			Blaze.renderWithData(Template.placeUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		}
	}
});

Template.placeProfileIdentityEdition.rendered = function() {
	$('#edit-identity-form input#input-activities').tagsinput('destroy');
	$('#edit-identity-form input#input-activities').tagsinput('items');
	Session.set('staticMapUrl', "");
}

Template.placeProfileIdentityEdition.helpers({
	staticMapUrl: function() {
		return Session.get('staticMapUrl');
	},
	errorMessage: function(field) {
		return Session.get('userUpdateIdentityErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateIdentityErrors')[field] ? 'has-error' : '';
	}
});

Template.placeProfileIdentityEdition.events({
	'click #close-identity-edit-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#identity-edit').popover('destroy');
	},
	'change #input-street-number, keypress #input-street-number, keypress #input-street-name, keypress #input-zipcode, keypress #input-city, change #select-country' : function(e,t) {
		// Hide the submit btn, display the check one
		t.find('#submit-identity').style.display = "none";
		t.find('#check-location').style.display = "inline-block";
		// Remove the map because it's no longer displaying the right adress
		Session.set('staticMapUrl', "");
	},
	'click #check-location, submit #edit-identity-form' : function(e,t) {
		e.preventDefault();

		var place = {
			id: t.data.place._id,
			name: t.find('#input-name').value,
			activities: $('#edit-identity-form input#input-activities').tagsinput('items'),
			streetNumber: t.find('#input-street-number').value,
			streetName: t.find('#input-street-name').value,
			city: t.find('#input-city').value,
			zipcode: t.find('#input-zipcode').value,
			countryCode: t.find('#select-country').value
		}

		place.address = place.streetNumber+ "+" + place.streetName + "+" + place.zipcode + "+" + place.city;
		place.address = place.address.replace(/ /g, '+');

		// Display the loader
		Session.set('staticMapUrl', "<img class='loader' src='/images/loader.gif' alt='loading'>");

		// Geocoding. See: https://developers.google.com/maps/documentation/geocoding/
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + place.address + "&components=country:" + place.countryCode;
	
		// Get geocode
		Meteor.http.get(url, function (error, result) {
			if (!error) {
				var data = result.data;
				//console.log(data);
				if (data.status == "OK") {
					place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];

					place.formattedAddress = data.results[0].formatted_address;
					// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
					Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=288x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");
				
					// Sanitize the place object
					delete place.address;

					// Display the submit btn
					t.find('#submit-identity').style.display = "inline-block";
					t.find('#check-location').style.display = "none";
					console.log(place);
					if (e.currentTarget.id == 'edit-identity-form') {
						Meteor.call('placeIdentityUpdate', place, function(error, result) {
							// Display the error to the user and abort
							if (error)
								return console.log(error.reason);

							// Destroy the view and the popover
							Blaze.remove(t.view);
							$('#identity-edit').popover('destroy');
						});
					};
				};
			}
		});
	}
})

Template.placeUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
		return Session.get('placeUpdateSocialProfilesErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('placeUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
	}
});

Template.placeUpdateSocialProfiles.events({
	'click #close-social-profiles-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#social-profiles').popover('destroy');
	},
	'submit #social-profiles-form' : function(e,t) {
		e.preventDefault();
		var socialProfiles = {
			id: t.data.place._id,
			facebook: t.find('#edit-facebook').value,
			flickr: t.find('#edit-flickr').value,
			twitter: t.find('#edit-twitter').value,
			website: t.find('#edit-website').value
		};

		var errors = validateUsersocialProfiles(socialProfiles);
		Session.set('placeUpdateSocialProfilesErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return; 

		Meteor.call('placeUpdateSocialProfiles', socialProfiles, function(error, result) {
			// Display the error to the user and abort
			if (error)
				console.log(error);

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#social-profiles').popover('destroy');
		});
	}
});