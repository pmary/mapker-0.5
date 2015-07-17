var firstClick = true;
var clickListener = function () {
  if (firstClick) { return firstClick = false; }
  console.log('click to close the popover');
  $('.update-social-profile-popover').css('display', 'none');
};

Template.placeUpdateSocialProfiles.helpers({
	errorMessage: function(field) {
		return Session.get('placeUpdateSocialProfilesErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('placeUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
	}
});

Template.placeUpdateSocialProfiles.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', clickListener,false);
});

Template.placeUpdateSocialProfiles.events({
  /**
	 * @summary Init and open the social profiles popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .open-update-social-profile-popover' : function(e, t) {
		// Display the popover
    e.preventDefault();
    t.find('.update-social-profile-popover').style.display = 'block';

    // Set a click event listener on the body to close the popover when the user click outstide
    document.body.addEventListener('click', clickListener, false);
	},
  /**
   * @summary Prevent the popover to close if the user click inside
   */
  'click': function (e, t) {
    e.stopPropagation();
  },
	/**
	 * @summary Remove the social profiles popover template instance and destroy the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #close-update-social-profiles-popover': function (e, t) {
		// Hide the popover
    t.find('.update-social-profile-popover').style.display = 'none';

    // Cancel the click listener
    document.body.removeEventListener('click', clickListener,false);
    firstClick = true;
	},
	/**
	 * @summary Check and update the place's social profiles, then close the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'submit #social-profiles-form' : function(e, t) {
    e.preventDefault();

		var socialProfiles = {
			id: Router.current().params._id,
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
