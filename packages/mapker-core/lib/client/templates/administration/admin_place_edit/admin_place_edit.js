var checkPlaceData = function (t) {
	return new Promise(function(resolve, reject) {
		var place = {
			name: t.find('#input-name').value,
			specialities: $('#select-specialities').val(),
			types: $('#select-types').val(),
			streetNumber: t.find('#input-street-number').value,
			streetName: t.find('#input-street-name').value,
			zipcode: t.find('#input-zipcode').value,
			countryCode: t.find('#select-country').value,
			city: t.find('#input-city').value
		};

		place.address = place.streetNumber+ "+" + place.streetName + "+" +place.city;
		place.address = place.address.replace(/ /g, '+');

		var errors = Places.validateLocation(place);
		Session.set('modalAddPlaceErrors', errors);
		if (Object.keys(errors).length) {
			return; // Abort the account creation due to errors
		}

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
					Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=500x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");

					place.formattedAddress = data.results[0].formatted_address;

					resolve(place);
				}
			}
		});
	});
};

Template.adminPlaceEdit.helpers({
	staticMapUrl: function () {
		return Session.get('staticMapUrl');
	},
	errorMessage: function (field) {
		if (Session.get('modalAddPlaceErrors')) {
			return Session.get('modalAddPlaceErrors')[field];
		}
	},
	errorClass: function (field) {
		if (Session.get('modalAddPlaceErrors')) {
			return !!Session.get('modalAddPlaceErrors')[field] ? 'has-error' : '';
		}
	},
	countries: function () {
    if (Session.get('countries')) {
      return Session.get('countries');
    }
    else {
      return [];
    }
  },
	/**
	 * @summary Return the data about the user who propose this place
	 */
	contact: function () {
		return Session.get('author');
	}
});

Template.adminPlaceEdit.rendered = function () {
	// Get the id of the user who submit this place
	var placeMembers = this.data.members,
	adminId;
	for (var z = 0; z < placeMembers.length; z++) {
		if (placeMembers[z].admin) {
			adminId = placeMembers[z].id;
		}
	}
	// Subscribe to the data of the user who propose this place
	Meteor.subscribe("admin_getUser", adminId, {
		onReady: function () {
			// Get the data of the user who propose this place
			Session.set('contact', Meteor.users.findOne({_id: adminId}));
		},
		onError: function (err) { console.log(err); }
	});

	$('.admin-place-edit [data-toggle="popover"]').popover();

	var place = this.data;

	var $selectTypes = $('select#select-types').selectize({maxItems: 3});
	selectizeTypes = $selectTypes[0].selectize;
	for (var i = 0; i < this.data.types.length; i++) {
		selectizeTypes.addItem(place.types[i], true);
	}

	var $selectSpecialities = $('select#select-specialities').selectize({maxItems: 5}, place.specialities);
	selectizeSpecialities = $selectSpecialities[0].selectize;
	for (var y = 0; y < place.specialities.length; y++) {
		selectizeSpecialities.addItem(place.specialities[y], true);
	}

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
					var $selectContry = $('.admin-place-edit select#select-country').selectize({maxItems: 1});
					selectizeCountry = $selectContry[0].selectize;
					selectizeCountry.addItem(place.countryCode, true);
				}, 0);
			}
		}
	});
};

Template.adminPlaceEdit.events({
	'click .user-action-see-on-map': function (e, t) {
		checkPlaceData(t).then(function(place) {
			//console.log(place);
		});
	},
	'submit #place-edition': function (e,t) {
		e.preventDefault();
		var activated = t.find('#activated');

		checkPlaceData(t).then(function(place) {

			console.log('activated', activated);

			Meteor.call('adminPlaceEdit', place, activated, function (error) {
				// display the error to the user and abort
				if (error) {
					console.log(error);
				}
			});
		});
	}
});
