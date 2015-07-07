Template.UserProfileLayout.rendered = function(){
};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	console.log(t);
	var resource = {
		id: t.data.user._id, // User id
		cover: t.data.user.profile.cover,
		avatar: t.data.user.profile.avatar,
		type: 'user'
	}
	Session.set('modalResource', resource);
}

Template.UserProfileLayout.events({
	/*****************************************************************************/
	/* Social bar */
	/*****************************************************************************/
	'click .user-actions-connect-button': function(e, t) {
		// Get the user id
		var resourceId = t.data.user._id;

		// Check if the user is loged in
		if (Meteor.user()) {
			// If the user is loged in, connect him to the given user
			Meteor.call('userSendConnectionRequest', resourceId, function(error, result) {
				if (error) { console.log(error) };
				console.log(result);
				//$('.user-actions-unfollow-button').html('Disconnect');
			});
		}
		else {
			// If the user isn't loged, open the modal to invite him to create an account or logged in
			Session.set('modalLoginRequiredErrors', {});
			// Open the login required modal
			Session.set('activeModal', "modalLoginRequired");
			$('#myModal').modal();
		}

		// Get the user id
		console.log(t.data.user._id);
	},
	'mouseover .user-actions-unconnect-button': function(e, t) {
		$('.user-actions-unfollow-button').html('Disconnect');
	},
	'mouseout .user-actions-unconnect-button': function(e, t) {
		$('.user-actions-unfollow-button').html('Connected');
	},
	'click .user-actions-unconnect-button': function(e, t) {
		// Get the user id
		var resourceId = t.data.user._id;

		Meteor.call('userUnfollow', resourceId, function(error, result) {
			if (error) { console.log(error) };
		});
	},
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
	'click #upload-avatar-btn': function(e, t) {
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		setModalData(t);
	},
	/*****************************************************************************/
	/* Identity edition UI */
	/*****************************************************************************/
	'click #identity-edit' : function(e,t) {
		if (t.find('#resource-infos-identity .popover')) {
			// Render the identity edition template to the popover.
			// Be sure to always call Blaze.remove when the View is no longer needed.
			// Doc: http://docs.meteor.com/#/full/blaze_renderwithdata
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateIdentityErrors', {});
			// Init the popover with empty content
			$('#identity-edit').popover({html: true, content: " ", placement: "bottom"});
			// Show the popover
			$('#identity-edit').popover('show');
			// Render the userProfileIdentityEdition template in the popover with the current template data
			Blaze.renderWithData(Template.userProfileIdentityEdition, t.data, t.find('#resource-infos-identity .popover-content'));
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
			Blaze.renderWithData(Template.userUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		} else {
			// Clean the errors and prevent undefined session var
			Session.set('userUpdateSocialProfilesErrors', {});
			// Init the popover with empty content
			$('#social-profiles').popover({html: true, content: " ", placement: "bottom"});
			// Show the popover
			$('#social-profiles').popover('show');
			// Render the userUpdateSocialProfiles template in the popover with the current template data
			Blaze.renderWithData(Template.userUpdateSocialProfiles, t.data, t.find('#resource-infos-social-profiles .popover-content'));
		}
	}
});

Template.userProfileIdentityEdition.helpers({
	errorMessage: function(field) {
		return Session.get('userUpdateIdentityErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateIdentityErrors')[field] ? 'has-error' : '';
	},
	localities: function() {
		return Session.get('localities');
	}
});

Template.userProfileIdentityEdition.events({
	/**
	 * @summary Get the potential cities by the country code and the postal code
	 * and display them to the user, using the Google geocoding API
	 * @see https://developers.google.com/maps/documentation/geocoding/
	 */
	'focusout #edit-zipcode': function(e,t) {
		var countryCode = t.find('#edit-select-country').value,
		zipcode = t.find('#edit-zipcode').value;

		// Get results by postal code and region iso code
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'componentRestrictions': { 'postalCode': zipcode }, region: countryCode }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				// Get the city from the results
				for (var i = 0; i < results[0].address_components.length; i++) {
					// If there is postcode localities it mean that there is many locality matching
					if (results[0].postcode_localities) {
						// Set the session variable with the locallities to display them on the from
						Session.set('localities', results[0].postcode_localities);
						$('#identity-form #edit-select-city').focus();
					} else {
						// Else, it mean there is only one locality matching
						// The 'locality' type indicates an incorporated city or town political entity.
						if (results[0].address_components[i].types[0] == "locality") {
							// Set the session variable with the locallity to display it on the from
							Session.set('localities', [results[0].address_components[i].long_name]);
							$('#identity-form #edit-select-city').focus();
						}
					}
				};
			} else {
				Session.set('localities', null);
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
	},
	'click #close-identity-edit-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#identity-edit').popover('destroy');
	},
	'submit #identity-form' : function(e,t) {
		e.preventDefault();
		var identity = {
			firstname: t.find('#edit-first-name').value,
			lastname: t.find('#edit-last-name').value,
			activity: t.find('#edit-activity').value,
			countryCode: t.find('#edit-select-country').value,
			zipcode: t.find('#edit-zipcode').value,
			city: t.find('#edit-select-city').value
		};

		var errors = validateUserIdentity(identity);
		Session.set('userUpdateIdentityErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return;

		// Get the city center coordinates
		var address = identity.city.replace(/ /g, "+");;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": address, 'componentRestrictions': { 'postalCode': identity.zipcode }, region: identity.countryCode }, function(results, status) {
			// Test if there is a location
			if (results[0].geometry.location) {
				// Get the lat and the lng
				var loc = [];
				for (var key in results[0].geometry.location) {
					var value = results[0].geometry.location[key];
					// Check if the value is a number
					if (!isNaN(parseFloat(value)) && isFinite(value)) {
						loc.push(value)
					};
				};

				// If our coordinates have the right format, save the user identity
				if (loc.length == 2) {
					identity.loc = loc;
					Meteor.call('userUpdateIdentity', identity, function(error, result) {
						// Display the error to the user and abort
						if (error)
							console.log(error);

						// Clear the session var
						Session.set('localities', null);

						// Destroy the view and the popover
						Blaze.remove(t.view);
						$('#identity-edit').popover('destroy');
					});
				};
			};
		});
	}
});

Template.userUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
		return Session.get('userUpdateSocialProfilesErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('userUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
	}
});

Template.userUpdateSocialProfiles.events({
	'click #close-social-profiles-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#social-profiles').popover('destroy');
	},
	'submit #social-profiles-form' : function(e,t) {
		e.preventDefault();
		var socialProfiles = {
			facebook: t.find('#edit-facebook').value,
			flickr: t.find('#edit-flickr').value,
			twitter: t.find('#edit-twitter').value,
			linkedin: t.find('#edit-linkedin').value,
			github: t.find('#edit-github').value,
			tumblr: t.find('#edit-tumblr').value,
			instagram: t.find('#edit-instagram').value,
			behance: t.find('#edit-behance').value,
			pinterest: t.find('#edit-pinterest').value,
			vimeo: t.find('#edit-vimeo').value,
			website: t.find('#edit-website').value
		};

		var errors = validateUsersocialProfiles(socialProfiles);
		Session.set('userUpdateSocialProfilesErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return;

		Meteor.call('userUpdateSocialProfiles', socialProfiles, function(error, result) {
			// Display the error to the user and abort
			if (error)
				console.log(error);

			// Destroy the view and the popover
			Blaze.remove(t.view);
			$('#social-profiles').popover('destroy');
		});
	}
});
