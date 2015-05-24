Template.placeProfileLayout.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 * @locus Anywhere
	 */
	isAdmin: function() {
		if (this.place && Meteor.user() && this.place.administrators.indexOf(Meteor.user()._id) > -1)
			return true;
		else
			return false;
	}
});

/**
 * @summary Test
 * @return {Boolean}
 * @locus Anywhere
 */
Template.placeProfileLayout.rendered = function(){
};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	var resource = {
		id: t.data.place._id,
		cover: t.data.place.cover,
		avatar: t.data.place.avatar,
		type: 'place'
	}
	Session.set('modalResource', resource);
}

Template.placeProfileLayout.events({
	/*****************************************************************************/
	/* Inner navigation UI */
	/*****************************************************************************/
	/**
	 * @summary Add the 'active' class name to the selected nav item and remove it from others
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/*****************************************************************************/
	/* Avatar and cover update UI */
	/*****************************************************************************/
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #upload-avatar-btn': function(e, t) { console.log(t);
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);
	},
	/*****************************************************************************/
	/* Identity edition UI */
	/*****************************************************************************/
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #identity-edit' : function(e, t) {
		if (t.find('#resource-infos-identity .popover')) {
			// Render the identity edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.placeProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateIdentityErrors', {});
			// Init the popover with empty content
			$(t.find('#identity-edit')).popover({html: true, content: " ", placement: "bottom"});
			// Show the popover
			$(t.find('#identity-edit')).popover('show');
			// Render the placeProfileIdentityEdition template in the popover with the current template data
			Blaze.renderWithData(Template.placeProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
		}
	},
	/*****************************************************************************/
	/* Social profiles UI */
	/*****************************************************************************/
	/**
	 * @summary Init and open the social profiles popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #add-social-profiles, click #edit-social-profiles' : function(e, t) {
		if (t.find('#resource-infos-social-profiles .popover')) {
			// Render the social profiles edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.placeUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('placeUpdateSocialProfilesErrors', {});
			// Init the popover with empty content
			$(t.find('#social-profiles')).popover({html: true, content: " ", placement: "bottom"});
			// Show the popover
			$(t.find('#social-profiles')).popover('show');
			// Render the placeUpdateSocialProfiles template in the popover with the current template data
			Blaze.renderWithData(Template.placeUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		}
	}
});

Template.placeProfileIdentityEdition.rendered = function() {
	// Destroy the existing tagsinput instance on the activities input field to prevent errors
	$('#edit-identity-form input#input-activities').tagsinput('destroy');
	// Set a new tagsinput instance for the activities input field
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
	/**
	 * @summary Init and open the social profiles popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #close-identity-edit-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#identity-edit').popover('destroy');
	},
	/**
	 * @summary Because the address has changed, force the user to recheck it before he can submit
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'change #input-street-number, keypress #input-street-number, keypress #input-street-name, keypress #input-zipcode, keypress #input-city, change #select-country' : function(e,t) {
		// Hide the submit btn, display the check one
		t.find('#submit-identity').style.display = "none";
		t.find('#check-location').style.display = "inline-block";
		// Remove the map because it's no longer displaying the right address
		Session.set('staticMapUrl', "");
	},
	/**
	 * @summary Check the location and if it's already ok, update the place document
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #check-location, submit #edit-identity-form' : function(e, t) {
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

		// Concatenate the location informations
		place.address = place.streetNumber+ "+" + place.streetName + "+" + place.zipcode + "+" + place.city;
		// Replace all the space occurences by a + for the reseach and url encode it
		place.address = encodeURI(place.address.replace(/ /g, '+'));

		// Display the loader
		Session.set('staticMapUrl', "<img class='loader' src='/images/loader.gif' alt='loading'>");

		// Prepare the Geocoding query url. See: https://developers.google.com/maps/documentation/geocoding/
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + place.address + "&components=country:" + place.countryCode;

		// Get the geocoding data
		Meteor.http.get(url, function (error, result) {
			if (error) return console.log(error);
			
			var data = result.data;

			if (data.status == "OK") {
				place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];

				place.formattedAddress = data.results[0].formatted_address;
				// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
				Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=288x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");
				
				// Sanitize the place object
				delete place.address; // No longer useful

				// If it was a check, we can now display the submit btn
				t.find('#submit-identity').style.display = "inline-block";
				t.find('#check-location').style.display = "none";

				// If the location has already been checker, update the place document
				if (e.currentTarget.id == 'edit-identity-form') {
					Meteor.call('placeIdentityUpdate', place, function(error, result) {
						// Display the error to the user and abort
						if (error) return console.log(error.reason);

						// Destroy the view and the popover
						Blaze.remove(t.view);
						$('#identity-edit').popover('destroy');
					});
				};
			};

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
	/**
	 * @summary Remove the social profiles popover template instance and destroy the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #close-social-profiles-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#social-profiles').popover('destroy');
	},
	/**
	 * @summary Check and update the place's social profiles, then close the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'submit #social-profiles-form' : function(e, t) {
		var socialProfiles = {
			id: t.data.place._id,
			facebook: t.find('#edit-facebook').value,
			flickr: t.find('#edit-flickr').value,
			twitter: t.find('#edit-twitter').value,
			website: t.find('#edit-website').value
		};

		// Check the form values
		var errors = validateUsersocialProfiles(socialProfiles);
		Session.set('placeUpdateSocialProfilesErrors', errors);
		// Abort the update due to errors
		if (Object.keys(errors).length) return;

		// Update the place document
		Meteor.call('placeUpdateSocialProfiles', socialProfiles, function(error, result) {
			if (error) return console.log(error); // Display the error to the user and abort

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#social-profiles').popover('destroy');
		});
	}
});