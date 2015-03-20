Template.modal.helpers({  
	activeModal: function() {
		return Session.get('activeModal');
	}
});

Template.modalAddPlace.created = function() {
	Session.set('staticMapUrl', "");
}

Template.modalAddPlace.helpers({
	staticMapUrl: function() {
		return Session.get('staticMapUrl');
	}
});

Template.modalAddPlace.events({
	'click #submit-place' : function(e, t){
		var name = t.find('#input-name').value,
		themes = $('#input-themes').tagsinput('items'),
		activities = $('#input-activities').tagsinput('items'),
		role = t.find('#input-role'),
		streetNumber = t.find('#input-street-number').value,
		streetName = t.find('#input-street-name').value,
		country = t.find('#select-country').value,
		city = t.find('#input-city').value;

		var address = streetNumber + streetName + city;
		address = address.replace(/ /g, '+');

		// If the form is valide

		// Geocoding. See: https://developers.google.com/maps/documentation/geocoding/
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&components=country:" + country;

		// Get geocode
		Meteor.http.get(url, function (error, result) {
			if (!error) {
				var data = result.data;
				console.log(data);
				// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
				Session.set('staticMapUrl', "<img style='width: 100%;' alt='" + name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + address + "&zoom=13&size=600x300&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");
			}
		});

	}
});