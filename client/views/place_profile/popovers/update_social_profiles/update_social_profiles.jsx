var editPlaceSocialProfilesClickListener = function () {
  $('.update-social-profile-popover').css('display', 'none');
};

var editPlaceLocationClickListener = function () {
  $('.update-place-location-popover').css('display', 'none');
};

var checkLocation = function (t) {
  // Return a new promise
  return new Promise(function (resolve, reject) {
    var place = {
      id: t.data.place._id,
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
      if (error) {
        Session.set('staticMapUrl', "");
        reject(Error(error));
      }

      var data = result.data;

      if (data.status == "OK") {
        place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];

        place.formattedAddress = data.results[0].formatted_address;
        // Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
        Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=277x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");

        // Sanitize the place object
        delete place.address; // No longer useful

        // If it was a check, we can now display the submit btn
        t.find('.submit-place-location-form').style.display = "inline-block";
        t.find('.check-location').style.display = "none";

        // Resolve the promise
        resolve(place);
      }
      else {
        Session.set('staticMapUrl', "");
        reject('No data found for this location');
      }

    })
  });
};

Template.placeUpdateSocialProfiles.helpers({
  staticMapUrl: function() {
		return Session.get('staticMapUrl');
	},
	errorMessage: function(field) {
		return Session.get('placeUpdateSocialProfilesErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('placeUpdateSocialProfilesErrors')[field] ? 'has-error' : '';
	}
});

Template.placeUpdateSocialProfiles.onDestroyed(function () {
  // Cancel the click listener
  document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
});

Template.placeUpdateSocialProfiles.events({
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
		var errors = validateUsersocialProfiles(socialProfiles);
		Session.set('placeUpdateSocialProfilesErrors', errors);
		// Abort the update due to errors
		if (Object.keys(errors).length) return;

		// Update the place document
		Meteor.call('placeUpdateSocialProfiles', socialProfiles, function(error, result) {
			if (error) return console.log(error); // Display the error to the user and abort

      // Hide the popover
      t.find('.update-social-profile-popover').style.display = 'none';

      // Cancel the click listener
      document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);
		});
	},
  /**
	 * @summary Open the location popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
  'click .open-update-place-location-popover': function (e, t) {
    e.preventDefault();

    Session.set('staticMapUrl', "");

    // Hide the 'save' btn and display the 'check location' one
    t.find('.submit-place-location-form').style.display = "none";
    t.find('.check-location').style.display = "inline-block";

    // Switch the button to the default state
		$('#resource-infos-social-profiles .update-place-location-popover .submit-place-location-form').removeClass('btn-loader');

    // Close the social profiles edition popover if necessary
    editPlaceSocialProfilesClickListener();
    document.body.removeEventListener('click', editPlaceSocialProfilesClickListener, false);

    // Switch the button to is default state if necessary
		$('.update-place-location-popover .submit-place-location-form').removeClass('btn-loader');

    // Display the popover
    t.find('.update-place-location-popover').style.display = 'block';

    // Set a click event listener on the body to close the popover when the user click outstide
    document.body.addEventListener('click', editPlaceLocationClickListener, false);
  },
  /**
	 * @summary Close the location popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .close-update-place-location-popover': function (e, t) {
		// Hide the popover
    t.find('.update-place-location-popover').style.display = 'none';

    // Cancel the click listener
    document.body.removeEventListener('click', editPlaceLocationClickListener, false);
	},
  'click .check-location' : function(e, t) {
		e.preventDefault();

    checkLocation(t).then(function(place) {
    }, function(error) {
      console.error('Error', error);
    });
	},
  'submit #place-location-form': function (e, t) {
    e.preventDefault();

    // Switch the button to the load state
		$('#resource-infos-social-profiles .update-place-location-popover .submit-place-location-form').addClass('btn-loader');

    checkLocation(t).then(function(place) {
      // Update the place document
      Meteor.call('placeLocationUpdate', place, function(error, result) {
        // Display the error to the user and abort
        if (error) return console.log(error.reason);

        // Hide the popover
        t.find('.update-place-location-popover').style.display = 'none';

        // Cancel the click listener
        document.body.removeEventListener('click', editPlaceLocationClickListener, false);
      });
    }, function(error) {
      console.error('Error', error);
    });

  }
});
