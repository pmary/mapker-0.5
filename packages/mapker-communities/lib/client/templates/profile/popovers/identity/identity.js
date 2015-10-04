var firstClick = true;
var editPopoverClickListener = function () {
  if (firstClick) {
    firstClick = false;
    return false;
  }

  $('.communty-profile-infos .identity-edition-popover').css('display', 'none');
  firstClick = true;
};

Template.communityProfileIdentityEdition.helpers({
	errorMessage: function(field) {
    if (Session.get('placeUpdateSocialProfilesErrors')) {
      return Session.get('placeUpdateSocialProfilesErrors')[field];
    }
	},
	errorClass: function (field) {
    if (Session.get('placeUpdateSocialProfilesErrors')) {
		  return !!Session.get('placeUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
    }
	}
});

Template.communityProfileIdentityEdition.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPopoverClickListener, false);
});

Template.communityProfileIdentityEdition.events({
  /**
   * @summary Open the upload modal and give it the needed data
   * @param {Object} [e] The current event
   * @param {Object} [t] The current template instance object
   */
  'click .open-identity-edition-popover': function(e, t) {
    e.preventDefault();

    // Switch the button to is default state if necessary
		$('.communty-profile-infos .submit-identity-form').removeClass('btn-loader');

    // Display the popover
    t.find('.identity-edition-popover').style.display = 'block';

    // Set a click event listener on the body to close the popover when the user click outstide
    document.body.addEventListener('click', editPopoverClickListener, false);
  },
  /**
   * @summary Prevent the popover to close if the user click inside
   */
  'click .identity-edition-popover': function (e) {
    e.stopPropagation();
  },
  /**
	 * @summary Close the popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
  'click .close-identity-edition-popover': function (e, t) {
    // Hide the popover
    t.find('.identity-edition-popover').style.display = 'none';

    // Cancel the click listener
    document.body.removeEventListener('click', editPopoverClickListener,false);
    firstClick = true;
  },
  'submit #edit-identity-form' : function(e, t) {
		e.preventDefault();

    // Switch the button to the load state
		$('.communty-profile-infos .submit-identity-form').addClass('btn-loader');

		var community = {
			id: t.data.community._id,
			name: t.find('#input-name').value
		};

    Meteor.call('mapker:communities/updateIdentity', community, function(error) {
      if (error) {
        throw error;
      }

      // Hide the popover
      t.find('.identity-edition-popover').style.display = 'none';

      // Cancel the click listener
      document.body.removeEventListener('click', editPopoverClickListener,false);
      firstClick = true;
    });
	}
});
