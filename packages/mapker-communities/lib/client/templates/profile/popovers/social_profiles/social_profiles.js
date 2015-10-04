var editPlaceSocialProfilesClickListener = function () {
  $('.update-social-profile-popover').css('display', 'none');
};

var editPlaceLocationClickListener = function () {
  $('.update-place-location-popover').css('display', 'none');
};

Template.communityUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
    if (Session.get('communityUpdateSocialProfilesErrors')) {
		  return Session.get('communityUpdateSocialProfilesErrors')[field];
    }
	},
	errorClass: function (field) {
    if (Session.get('communityUpdateSocialProfilesErrors')) {
		  return !!Session.get('communityUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
    }
	}
});

Template.communityUpdateSocialProfiles.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
});

Template.communityUpdateSocialProfiles.events({
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
	/**
	 * @summary Check and update the place's social profiles, then close the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'submit #social-profiles-form' : function(e, t) {
    e.preventDefault();

    // Switch the button to the load state
		$('.update-social-profile-popover #save-identity-btn').addClass('btn-loader');

		var socialProfiles = {
			id: Router.current().params._id,
			facebook: t.find('#edit-facebook').value,
			flickr: t.find('#edit-flickr').value,
			twitter: t.find('#edit-twitter').value,
			website: t.find('#edit-website').value
		};

		// Check the form values
		var errors = Core.validateUsersocialProfiles(socialProfiles);
		Session.set('communityUpdateSocialProfilesErrors', errors);
		// Abort the update due to errors
		if (Object.keys(errors).length) {
      return;
    }

    // Check if none of the links has a value
    if (
      socialProfiles.facebook === '' &&
      socialProfiles.flickr   === '' &&
      socialProfiles.twitter  === '' &&
      socialProfiles.website  === ''
    ) {
      // Remove the links
      Meteor.call('mapker:communities/removeLinks', socialProfiles.id, function (error) {
        if (error) {
          return console.log(error);
        }

        // Hide the popover
        t.find('.update-social-profile-popover').style.display = 'none';

        // Cancel the click listener
        document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
      });
    }
    else {
  		// Update the place document
  		Meteor.call('mapker:communities/updateLinks', socialProfiles, function(error, result) {
  			if (error) {
          return console.log(error);
        }

        // Hide the popover
        t.find('.update-social-profile-popover').style.display = 'none';

        // Cancel the click listener
        document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
  		});
    }
	}
});
