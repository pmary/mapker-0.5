Template.placeProfileLayout.helpers({
	/**
	 * @summary Return if whether or not the current user is administrator of the place
	 * @return {Boolean}
	 */
	isAdmin: function() {
		if (this.place && Meteor.user()) {
			var isAdmin = Places.findOne({_id: this.place._id, members: { $elemMatch: { id: Meteor.user()._id, admin: true } } });
			if (isAdmin) {
				return true;
			}
			else {
				return false;
			}
		}
	}
});

/**
 * @summary Test
 * @return {Boolean}
 * @locus Anywhere
 */
Template.placeProfileLayout.rendered = function(){
};

/**
 * @summary Set the 'modalResource' session variable with the data related to the current resource
 * @param {Object} [t] The current template instance object
 */
var setModalData = function(t) {
	var resource = {
		id: t.data.place._id,
		cover: t.data.place.cover,
		avatar: t.data.place.avatar,
		type: 'place'
	}
	Session.set('modalResource', resource);
}

Template.placeProfileLayout.events({
	/*****************************************************************************/
	/* Inner navigation UI */
	/*****************************************************************************/
	/**
	 * @summary Add the 'active' class name to the selected nav item and remove it from others
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #inner-nav a' : function(e, t){
		$('#inner-nav li').removeClass('active');
		e.target.parentNode.className = 'active';
	},
	/*****************************************************************************/
	/* Avatar and cover update UI */
	/*****************************************************************************/
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .upload-cover-btn' : function(e, t){
		// Open the cover change modal
		Session.set('modalChangeCoverErrors', {});
		Session.set('activeModal', 'modalChangeCover');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);

		// Display the upload btn and hide the helper tool
		$('.modal-change-cover .image-upload-container .helper-tool').css('display', 'none');
	},
	/**
	 * @summary Open the upload modal and give it the needed data
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click #upload-avatar-btn': function(e, t) { console.log(t);
		// Open the cover change modal
		Session.set('modalChangeAvatarErrors', {});
		Session.set('activeModal', 'modalChangeAvatar');
		// Pass the mandatory data to the modal instance via a session variable
		setModalData(t);
	},
	/*****************************************************************************/
	/* Social bar UI */
	/*****************************************************************************/
	/**
	 * @summary Open the modal that allow the user to send a message to the place owner
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	'click .user-action-message': function (e, t) {
		// Set the session var with the current resource data
		Session.set('modalMessage', t.data);

		// Open the add message modal
		Session.set('activeModal', 'modalSendMessage');
		$('#myModal').modal();
	}
});

Template.placeProfileIdentityEdition.events({
	/**
	 * @summary Init and open the social profiles popover
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	/*'click #close-identity-edit-popover': function (e, t) {
		// Destroy the view and the popover
		Blaze.remove(t.view);
		$('#edit-identity-form').popover('destroy');
	},*/
	/**
	 * @summary Because the address has changed, force the user to recheck it before he can submit
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	/*'change #input-street-number, keypress #input-street-number, keypress #input-street-name, keypress #input-zipcode, keypress #input-city, change #select-country' : function(e,t) {
		// Hide the submit btn, display the check one
		t.find('#submit-identity').style.display = "none";
		t.find('#check-location').style.display = "inline-block";
		// Remove the map because it's no longer displaying the right address
		Session.set('staticMapUrl', "");
	},*/
	/**
	 * @summary Check the location and if it's already ok, update the place document
	 * @param {Object} [e] The current event
	 * @param {Object} [t] The current template instance object
	 */
	/*'click #check-location, submit #edit-identity-form' : function(e, t) {
		e.preventDefault();

		var place = {
			id: t.data.place._id,
			name: t.find('#input-name').value,
			types: $('#edit-identity-form #select-types').val(),
			specialities: $('#edit-identity-form #select-specialities').val(),
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
			if (error) return console.log(error);

			var data = result.data;

			if (data.status == "OK") {
				place.loc = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];

				place.formattedAddress = data.results[0].formatted_address;
				// Get the static map. See: https://developers.google.com/maps/documentation/staticmaps
				Session.set('staticMapUrl', "<img class='static-map' alt='" + place.name + " map' src='https://maps.googleapis.com/maps/api/staticmap?center=" + place.address + "&zoom=13&size=288x150&maptype=terrain&markers=icon:http://mapker.co/images/pins/pin_place.png%7C" + data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng + "'>");

				// Sanitize the place object
				delete place.address; // No longer useful

				// If it was a check, we can now display the submit btn
				t.find('#submit-identity').style.display = "inline-block";
				t.find('#check-location').style.display = "none";

				// If the location has already been checker, update the place document
				if (e.currentTarget.id == 'edit-identity-form') {
					Meteor.call('placeIdentityUpdate', place, function(error, result) {
						// Display the error to the user and abort
						if (error) return console.log(error.reason);

						// Destroy the view and the popover
						Blaze.remove(t.view);
						$('#edit-identity-form').popover('destroy');
					});
				};
			};

		});
	}*/
});
