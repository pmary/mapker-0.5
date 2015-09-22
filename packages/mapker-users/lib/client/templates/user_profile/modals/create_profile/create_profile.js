var selectizeCountry = null;

Template.modalCreateProfile.helpers({
	errorMessage: function (field) {
		return Session.get('modalCreateProfileErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalCreateProfileErrors')[field] ? 'has-error' : '';
	},
	localities: function () {
		return Session.get('localities');
	},
	countries: function () {
    if (Session.get('countries')) {
      return Session.get('countries');
    }
    else {
      return [];
    }
  }
});

Template.modalCreateProfile.created = function() {
};

Template.modalCreateProfile.rendered = function () {
	$('.modal-create-profile [data-toggle="popover"]').popover();

	$('#input-activity').focus();

	this.autorun(function (computation) {
		// If there is no selectize instance on the country select
		if (! selectizeCountry) {
			// Get the countries
			var countries = Countries.find().fetch();

			//console.log('Countries length: ', countries.length);

			// If all the countries has been retrieved
			if (countries.length == 245) {
				// Stop the tracker
				computation.stop();

				Session.set('countries', countries);

				setTimeout(function () {
					// Init a selectize instance on the country select
					var $selectContry = $('.modal-create-profile select#select-country').selectize({
						maxItems: 1
					});

					selectizeCountry = $selectContry[0].selectize;
				}, 0);
			}
		}
	});
};

Template.modalCreateProfile.onDestroyed(function () {
  // Destroy the selectize instance on the country select
  if (selectizeCountry) {
		selectizeCountry.destroy();
  	selectizeCountry = null;
	}
});

Template.modalCreateProfile.events({
	/**
	 * @summary Get the potential cities by the country code and the postal code
	 * and display them to the user, using the Google geocoding API
	 * @see https://developers.google.com/maps/documentation/geocoding/
	 */
	'keyup #input-zipcode': function(e,t) {
		var countryCode = t.find('#select-country').value,
		zipcode = t.find('#input-zipcode').value;

		if (zipcode.length > 5) return;

		// Get results by postal code and region iso code
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'componentRestrictions': { 'postalCode': zipcode }, region: countryCode }, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				// Get the city from the results
				for (var i = 0; i < results[0].address_components.length; i++) {
					// If there is postcode localities it mean that there is many locality matching
					if (results[0].postcode_localities) {
						// Set the session variable with the locallities to display them on the from
						Session.set('localities', results[0].postcode_localities);
						//$('#create-profile-form #select-city').focus();
					} else {
						// Else, it mean there is only one locality matching
						// The 'locality' type indicates an incorporated city or town political entity.
						if (results[0].address_components[i].types[0] == "locality") {
							// Set the session variable with the locallity to display it on the from
							Session.set('localities', [results[0].address_components[i].long_name]);
							//$('#create-profile-form #select-city').focus();
						}
					}
				}
			} else {
				Session.set('localities', null);
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
	},
	'submit #create-profile-form' : function(e, t){
		e.preventDefault();

		var profile = {
			activity: t.find('#input-activity').value,
			countryCode: t.find('#select-country').value,
			zipcode: t.find('#input-zipcode').value,
			city: t.find('#select-city').value
		};

		var errors = Users.validateAddProfile(profile);
		Session.set('modalCreateProfileErrors', errors);
		if (Object.keys(errors).length)
			return; // Abort the account creation due to errors

		// Get the city center coordinates
		var address = profile.city.replace(/ /g, "+");
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": address, 'componentRestrictions': { 'postalCode': profile.zipcode }, region: profile.countryCode }, function(results, status) {
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

				// If our coordinates have the right format, save the user profile
				if (loc.length === 2) {
					profile.loc = loc;
					Meteor.call('mapker:users/createProfile', profile, function(error) {
						// display the error to the user and abort
						if (error) {
							throw error;
						}

						// Clear the session var
						Session.set('localities', null);

						// Close the modal
						$('#myModal').modal({
							backdrop: true,
					  		keyboard: true
						});
						$('#myModal').modal('hide');
				    });
				}
			}
		});
	}
});
