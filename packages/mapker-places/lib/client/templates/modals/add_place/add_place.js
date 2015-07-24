Template.modalAddPlace.created = function () {
};

Template.modalAddPlace.rendered = function () {
	$('.modal-add-place [data-toggle="popover"]').popover();

	$('select#select-types').selectize({
		maxItems: 3
	});

	$('select#select-specialities').selectize({
		maxItems: 5
	});
};

Template.modalAddPlace.helpers({
	staticMapUrl: function () {
		return Session.get('staticMapUrl');
	},
	errorMessage: function (field) {
		return Session.get('modalAddPlaceErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('modalAddPlaceErrors')[field] ? 'has-error' : '';
	}
});

var checkPlaceData = function (t, step) {
	var place = {
		name: t.find('#input-name').value,
		specialities: $('#select-specialities').val(),
		phone: t.find('#input-phone').value,
		types: $('#select-types').val(),
		role: t.find('#input-role').value,
		streetNumber: t.find('#input-street-number').value,
		streetName: t.find('#input-street-name').value,
		zipcode: t.find('#input-zipcode').value,
		countryCode: t.find('#select-country').value,
		city: t.find('#input-city').value
	};

	place.address = place.streetNumber+ "+" + place.streetName + "+" +place.city;
	place.address = place.address.replace(/ /g, '+');

	var errors = validateLocation(place);
	Session.set('modalAddPlaceErrors', errors);
	if (Object.keys(errors).length)
		return; // Abort the account creation due to errors

	// Display the loader
	Session.set('staticMapUrl', "<img class='loader' src='/images/loader.gif' alt='loading'>");

	// Geocoding. See: https://developers.google.com/maps/documentation/geocoding/
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + place.address + "&components=country:" + place.countryCode;

	// Get geocode
	Meteor.http.get(url, function (error, result) {
		if (!error) {
			//console.log(result);
			var data = result.data;

			if (data.status === "OK") {
				place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];
				// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
				Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=600x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");

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

					Meteor.call('placeInsert', place, function(error) {
						// Display the error to the user and abort
						if (error)
							return console.log(error.reason);

						// Redirect to the user places page
						Router.go('userProfilePlaces', {_id: Meteor.user()._id});
						// Close the modal
						$('#myModal').modal('hide');
					});
				}
			}
		}
	});
};

Template.modalAddPlace.events({
	'keypress #input-street-number, change #input-street-number, keypress #input-street-name, keypress #input-city, change #select-country' : function(e, t){
		t.find('#submit-place').style.display = "none";
		t.find('#check-location').style.display = "inline-block";
	},
	'click #submit-place' : function(e, t){
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
