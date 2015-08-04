var firstClick = true;
var editPopoverClickListener = function () {
  if (firstClick) {
    firstClick = false;
    return false;
  }

  $('.user-profile-infos .identity-edition-popover').css('display', 'none');
  firstClick = true;
};

Template.userProfileIdentityEdition.helpers({
	errorMessage: function(field) {
    if (Session.get('userUpdateIdentityErrors')) {
        return Session.get('userUpdateIdentityErrors')[field];
    }
	},
	errorClass: function (field) {
    if (Session.get('userUpdateIdentityErrors')) {
      return !!Session.get('userUpdateIdentityErrors')[field] ? 'has-error' : '';
    }
	}
});

Template.userProfileIdentityEdition.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPopoverClickListener, false);
});

Template.userProfileIdentityEdition.events({
  /**
   * @summary Open the upload modal and give it the needed data
   * @param {Object} [e] The current event
   * @param {Object} [t] The current template instance object
   */
  'click .open-identity-edition-popover': function(e, t) {
    e.preventDefault();

    // Switch the button to is default state if necessary
		$('.user-profile-infos .submit-identity-form').removeClass('btn-loader');

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
	'click #close-identity-edit-popover': function (e, t) {
	},
	'submit #identity-form' : function(e,t) {
		e.preventDefault();

    // Switch the button to the load state
		$('.user-profile-infos .submit-identity-form').addClass('btn-loader');

		var identity = {
			firstname: t.find('#edit-first-name').value,
			lastname: t.find('#edit-last-name').value,
			activity: t.find('#edit-activity').value
		};

		var errors = Users.validateUserIdentity(identity);
		Session.set('userUpdateIdentityErrors', errors);
		if (Object.keys(errors).length) {
			// Abort the account creation due to errors
			return;
    }

    Meteor.call('userUpdateIdentity', identity, function(error, result) {
      // Display the error to the user and abort
      if (error) {
        console.log(error);
      }

      // Clear the session var
      Session.set('localities', null);

      // Hide the popover
      t.find('.identity-edition-popover').style.display = 'none';

      // Cancel the click listener
      document.body.removeEventListener('click', editPopoverClickListener,false);
      firstClick = true;
    });
	}
});
