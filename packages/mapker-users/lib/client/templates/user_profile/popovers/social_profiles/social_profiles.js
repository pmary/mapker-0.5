var editPlaceSocialProfilesClickListener = function () {
  $('.update-social-profile-popover').css('display', 'none');
};

var editPlaceLocationClickListener = function () {
  $('.update-place-location-popover').css('display', 'none');
};

Template.userUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
    if (Session.get('userUpdateSocialProfilesErrors')) {
		  return Session.get('userUpdateSocialProfilesErrors')[field];
    }
	},
	errorClass: function (field) {
    if (Session.get('userUpdateSocialProfilesErrors')) {
		  return !!Session.get('userUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
    }
	}
});

Template.userUpdateSocialProfiles.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
});

Template.userUpdateSocialProfiles.events({
  /**
	 * @summary Open the social profiles popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .open-update-social-profile-popover' : function(e, t) {
    e.preventDefault();

    // Close the location edition popover if necessary
    editPlaceLocationClickListener();
    document.body.removeEventListener('click', editPlaceLocationClickListener, false);

    // Switch the button to is default state if necessary
		$('.update-social-profile-popover #save-identity-btn').removeClass('btn-loader');

    // Display the popover
    t.find('.update-social-profile-popover').style.display = 'block';

    // Set a click event listener on the body to close the popover when the user click outstide
    document.body.addEventListener('click', editPlaceSocialProfilesClickListener, false);
	},
  /**
   * @summary Prevent the popover to close if the user click inside
   */
  'click': function (e, t) {
    e.stopPropagation();
  },
	/**
	 * @summary Close the social profiles edition popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #close-update-social-profiles-popover': function (e, t) {
		// Hide the popover
    t.find('.update-social-profile-popover').style.display = 'none';

    // Cancel the click listener
    document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
	},
	'submit #social-profiles-form' : function(e,t) {
		e.preventDefault();

    // Switch the button to the load state
		$('.update-social-profile-popover #save-identity-btn').addClass('btn-loader');

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

		var errors = Users.validateUsersocialProfiles(socialProfiles);
		Session.set('userUpdateSocialProfilesErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return;

		Meteor.call('userUpdateSocialProfiles', socialProfiles, function(error, result) {
			// Display the error to the user and abort
			if (error) {
				console.log(error);
      }

      // Hide the popover
      t.find('.update-social-profile-popover').style.display = 'none';

      // Cancel the click listener
      document.body.removeEventListener('click', editPlaceLocationClickListener, false);
		});
	}
});
