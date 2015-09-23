var selectizeCountry = null;
var selectizeTypes = null;
var selectizeSpecialities = null;

var checkPlaceData = function (t, step) {
	var place = {
		name: t.find('#input-name').value,
		specialities: $('#select-specialities').val(),
		types: $('#select-types').val(),
		streetNumber: t.find('#input-street-number').value,
		streetName: t.find('#input-street-name').value,
		zipcode: t.find('#input-zipcode').value,
		countryCode: t.find('#select-country').value,
		city: t.find('#input-city').value
	},
	phone = t.find('#input-phone').value,
	role = t.find('#input-role').value;

	place.address = place.streetNumber+ "+" + place.streetName + "+" +place.city;
	place.address = place.address.replace(/ /g, '+');

	var errors = Places.validateLocation(place);
	// Check the phone number
	var phoneError = Core.phoneValidation(phone);
	if (phoneError) {errors.phone = phoneError;}
	// Check the role field
	var roleError = Core.isFilledValidation(role);
	if (roleError) {errors.role = roleError;}
	// Display the error
	Session.set('modalCreatePlaceErrors', errors);
	if (Object.keys(errors).length)
		return; // Abort the account creation due to errors

	if (step !== "submit") {
		// Display the loader
		Session.set('staticMapUrl', "<img class='loader' src='/images/loader.gif' alt='loading'>");
	}

	// Geocoding. See: https://developers.google.com/maps/documentation/geocoding/
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + place.address + "&components=country:" + place.countryCode;

	// Get geocode
	Meteor.http.get(url, function (error, result) {
		if (!error) {
			//console.log(result);
			var data = result.data;

			if (data.status === "OK") {
				place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];

				if (step !== "submit") {
					// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
					Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=600x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");
				}

				// Display the submit btn
				t.find('#submit-place').style.display = "inline-block";
				t.find('#check-location').style.display = "none";

				if (step === "submit") {
					// Insert the place in the db
					// Set the formated address
					place.formattedAddress = data.results[0].formatted_address;

					// Sanitize the place object
					delete place.address;

					//console.log(place);

					Meteor.call('mapker:places/insert', place, phone, role, function(error) {
						// Display the error to the user and abort
						if (error) {
							return console.log(error.reason);
						}

						$('.modal-create-place #submit-place').removeClass('btn-loader');

						// Redirect to the user places page
						Router.go('userProfilePlaces', {_id: Meteor.user()._id});
						// Close the modal
						Modal.hide();

						// Clear the form
						t.find('#input-name').value = '';
						selectizeSpecialities.clear(true);
						t.find('#input-phone').value = '';
						selectizeTypes.clear(true);
						t.find('#input-role').value = '';
						t.find('#input-street-number').value = '';
						t.find('#input-street-name').value = '';
						t.find('#input-zipcode').value = '';
						selectizeCountry.clear(true);
						t.find('#input-city').value = '';
					});
				}
			}
		}
	});
};

Template.modalCreatePlace.helpers({
	staticMapUrl: function () {
		return Session.get('staticMapUrl');
	},
	errorMessage: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return Session.get('modalCreatePlaceErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('modalCreatePlaceErrors')) {
			return !!Session.get('modalCreatePlaceErrors')[field] ? 'has-error' : '';
		}
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

Template.modalCreatePlace.rendered = function () {
	$('.modal-create-place [data-toggle="popover"]').popover();
	$('.modal-create-place #submit-place').removeClass('btn-loader');

	Session.set('staticMapUrl', null);

	var $selectTypes = $('select#select-types').selectize({
		maxItems: 3
	});
	selectizeTypes = $selectTypes[0].selectize;

	var $selectSpecialities = $('select#select-specialities').selectize({
		maxItems: 5
	});
	selectizeSpecialities = $selectSpecialities[0].selectize;

	// Subscribe to the Countries
	Meteor.subscribe("countriesList");

	this.autorun(function (computation) {
		// If there is no selectize instance on the country select
		if (! selectizeCountry) {
			// Get the countries
			var countries = Countries.find().fetch();

			// If all the countries has been retrieved
			if (countries.length == 245) {
				// Stop the tracker
				computation.stop();

				Session.set('countries', countries);

				setTimeout(function () {
					// Init a selectize instance on the country select
					var $selectContry = $('.modal-create-place select#select-country').selectize({
						maxItems: 1
					});

					selectizeCountry = $selectContry[0].selectize;
				}, 0);
			}
		}
	});
};

Template.modalCreatePlace.onDestroyed(function () {
  // Destroy the selectize instance on the country select
	if (selectizeCountry) {
  	selectizeCountry.destroy();
  	selectizeCountry = null;
	}

	if (selectizeTypes) {
		selectizeTypes.destroy();
  	selectizeTypes = null;
	}

	if (selectizeSpecialities) {
		selectizeSpecialities.destroy();
  	selectizeSpecialities = null;
	}
});

Template.modalCreatePlace.events({
	'keypress #input-street-number, change #input-street-number, keypress #input-street-name, keypress #input-city, change #select-country' : function(e, t){
		$('.modal-create-place #submit-place').css('display', "none");
		$('.modal-create-place #check-location').css('display', "inline-block");
	},
	'click #submit-place' : function(e, t){
		$('.modal-create-place #submit-place').addClass('btn-loader');
		checkPlaceData(t, "submit");
	},
	'click #check-location' : function(e, t){
		checkPlaceData(t, "check");
	},
	'focus .bootstrap-tagsinput input' : function (e) {
		e.target.parentNode.className += " focus-input-tag";
	},
	'focusout .bootstrap-tagsinput input' : function (e){
		var parrentClass = e.target.parentNode.className;
		e.target.parentNode.className = parrentClass.replace(" focus-input-tag", "");
	}
});
