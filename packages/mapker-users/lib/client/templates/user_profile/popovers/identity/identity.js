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
	},
	localities: function() {
		return Session.get('localities');
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
				}
			} else {
				Session.set('localities', null);
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
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
			activity: t.find('#edit-activity').value,
			countryCode: t.find('#edit-select-country').value,
			zipcode: t.find('#edit-zipcode').value,
			city: t.find('#edit-select-city').value
		};

		var errors = Users.validateUserIdentity(identity);
		Session.set('userUpdateIdentityErrors', errors);
		if (Object.keys(errors).length)
			// Abort the account creation due to errors
			return;

		// Get the city center coordinates
		var address = identity.city.replace(/ /g, "+");
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
						loc.push(value);
					}
				}

				// If our coordinates have the right format, save the user identity
				if (loc.length == 2) {
					identity.loc = loc;
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
			}
		});
	}
});
