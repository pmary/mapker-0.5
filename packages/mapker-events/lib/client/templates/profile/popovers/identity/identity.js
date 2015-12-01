var firstClick = true;
var editPopoverClickListener = function () {
  if (firstClick) {
    firstClick = false;
    return false;
  }

  $('.place-profile-infos .identity-edition-popover').css('display', 'none');
  firstClick = true;
};

Template.eventProfileIdentityEdition.helpers({
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

Template.eventProfileIdentityEdition.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPopoverClickListener, false);
});

Template.eventProfileIdentityEdition.events({
  /**
   * @summary Open the upload modal and give it the needed data
   * @param {Object} [e] The current event
   * @param {Object} [t] The current template instance object
   */
  'click .open-identity-edition-popover': function(e, t) {
    e.preventDefault();

    // Switch the button to is default state if necessary
		$('.place-profile-infos .submit-identity-form').removeClass('btn-loader');

    // Display the popover
    t.find('.identity-edition-popover').style.display = 'block';

    // Set a click event listener on the body to close the popover when the user click outstide
    document.body.addEventListener('click', editPopoverClickListener, false);

  	// Set a new selectize instance for the types select field
  	var typesSelectize = $('.place-profile-infos .identity-edition-popover select#select-types').selectize({
  		maxItems: 3
  	});
  	// Set current types by default
  	var types = t.data.place.types;
  	for (var i = 0; i < types.length; i++) {
  		types[i] = types[i].toLowerCase();
  	}
  	typesSelectize[0].selectize.setValue( types );

  	// Set a new selectize instance for the specialities select field
  	var specialitiesSelectize = $('.place-profile-infos .identity-edition-popover select#select-specialities').selectize({
  		maxItems: 5
  	});
  	// Set current specialities by default
  	var specialities = t.data.place.specialities;
  	for (var y = 0; y < specialities.length; y++) {
  		specialities[y] = specialities[y].toLowerCase();
  	}
  	specialitiesSelectize[0].selectize.setValue( specialities );
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
		$('.place-profile-infos .submit-identity-form').addClass('btn-loader');

		var place = {
			id: t.data.place._id,
			name: t.find('#input-name').value,
			types: $('#edit-identity-form #select-types').val(),
			specialities: $('#edit-identity-form #select-specialities').val()
		};

    Meteor.call('mapker:places/identityUpdate', place, function(error) {
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
