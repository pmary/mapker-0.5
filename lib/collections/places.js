Places = new Meteor.Collection('places');

/**
 * Front validators 
 */
validateLocation = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var typesError = isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var phoneError = phoneValidation(place.phone);
	if (phoneError) {
		errors.phone = phoneError;
	}

	var specialitiesError = isArrayValidation(place.specialities);
	if (specialitiesError) {
		errors.specialities = specialitiesError;
	}

	var roleError = isFilledValidation(place.role);
	if (roleError) {
		errors.role = roleError;
	}

	var addressError = isFilledValidation(place.address);
	if (addressError) {
		errors.address = addressError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateOpeningHours = function (openingHours) {
	var errors = {};

	var moError = isStringValidation(openingHours.mo);
	if (moError) {
		errors.mo = moError;
	}

	var tuError = isStringValidation(openingHours.tu);
	if (tuError) {
		errors.tu = tuError;
	}

	var weError = isStringValidation(openingHours.we);
	if (weError) {
		errors.we = weError;
	}

	var thError = isStringValidation(openingHours.th);
	if (thError) {
		errors.th = thError;
	}

	var frError = isStringValidation(openingHours.fr);
	if (frError) {
		errors.fr = frError;
	}

	var saError = isStringValidation(openingHours.sa);
	if (saError) {
		errors.sa = saError;
	}

	var suError = isStringValidation(openingHours.su);
	if (suError) {
		errors.su = suError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}


/**
 * Methods 
 */
Meteor.methods({
	placeInsert: function(placeAttributes) {
		// Data check
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, {
			specialities: Array,
			city: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array,
			name: String,
			role: String,
			streetName: String,
			streetNumber: String,
			types: Array,
			zipcode: String,
			phone: String
		});
		// Set complementary data
		var user = Meteor.user();
		var administrators = Meteor.user();
		var place = _.extend(placeAttributes, {
			administrators: [user._id], 
			activated: false, 
			//cover: "",
			//description: "",
			//logo: "",
			//machines: [],
			submittedBy: user._id,
			submittedAt: new Date()
		});
		place.loc = { lat: place.loc[0], lon: place.loc[1] };
		// Inster the post
		var placeId = Places.insert(place);

		// Notify the admin that he have a new place to validate by email
		if (Meteor.isServer) {
			Email.send({
				to: "contact@pierre-mary.fr",
				from: "noreply@mapker.co",
				subject: "New place waiting for validation",
				html: "Hello dear moderator, <br>A place named " + place.name + " is waiting for your validation on <a href='http://mapker.co'>Mapker</a>.",
				text: "Hello dear moderator, \n\nA place named " + place.name + " is waiting for your validation on Mapker (http://mapker.co)."
		    });
	    }

	    // Update the place ElasticSearch document
		Meteor.call('updatePlaceESDocument', placeId);

		return {
			_id: placeId
		};
	},
	adminPlaceEdit: function(placeAttributes) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, Object);
		check(placeAttributes.place, {
			_id: String,
			administrators: Array,
			name: String
		});
		
		if (placeAttributes.activated) {
			check(placeAttributes.activated, Boolean);
		};

		var place = _.extend(placeAttributes.place);
		if (placeAttributes.activated) {
			console.log("the place will be activated");
			var placeId = Places.update({_id: place._id}, { $set: {activated: placeAttributes.activated, name: place.name} });
		}else {
			var placeId = Places.update({_id: place._id}, { $set: {name: place.name} });
		};

		// Notify the user that his place has been validated
		if (Meteor.isServer) {
			if (!placeAttributes.activated)
				return;

			var admins = Meteor.users.find({_id: { $in: place.administrators } }, {item: 1, emails: 1}).fetch();
			//check(Meteor.userId(), String);
			for (var i = 0; i < admins.length; i++) {
				if (admins[i].emails[0].address) {
					console.log(admins[i].emails[0].address);
					Email.send({
						to: admins[i].emails[0].address,
						from: "noreply@mapker.co",
						subject: "Your place has been validated",
						html: "Thank you for your submission, <br>" + place.name + " has been validated. You can now edit it at <a href='http://mapker.co/places/" + place._id + "'>http://mapker.co/places/" + place._id + "</a>.",
						text: "Thank you for your submission, \n\n" + place.name + " has been validated. You can now edit it at http://mapker.co/places/" + place._id + "."
				    });
				    console.log("Email send to: " + admins[i].profile.firstname);
				};
			};
			
	    }
	},
	placeIdentityUpdate: function(place) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(place, {
			id: String,
			name: String,
			specialities: Array,
			types: Array,
			streetNumber: String,
			streetName: String,
			city: String,
			zipcode: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array
		});
		Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: place.id} ] }, { $set: {
			name: place.name,
			specialities: place.specialities,
			types: place.types,
			streetNumber: place.streetNumber,
			streetName: place.streetName,
			city: place.city,
			zipcode: place.zipcode,
			countryCode: place.countryCode,
			formattedAddress: place.formattedAddress,
			loc: { lat: place.loc[0], lon: place.loc[1] }
		} });

		// Update the place ElasticSearch document
		Meteor.call('updatePlaceESDocument', place.id);
	},
	placeUpdateSocialProfiles: function(placeSocialProfiles) {
		check(Meteor.userId(), String);
		check(placeSocialProfiles, {
			id: String,
			facebook: String,
			flickr: String,
			twitter: String,
			website: String
		});
		var user = Meteor.user();
		Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: placeSocialProfiles.id} ] }, { $set: {
			'links.facebook': placeSocialProfiles.facebook,
			'links.flickr': placeSocialProfiles.flickr,
			'links.twitter': placeSocialProfiles.twitter,
			'links.website': placeSocialProfiles.website
		} });

		// Update the place ElasticSearch document
		Meteor.call('updatePlaceESDocument', Meteor.userId());
	},
	placeUpdateAbout: function(place) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(place, {
			id: String,
			about: String
		});
		var placeId = Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: place.id} ] }, { $set: {
			'about': removeTags(place.about)
		} });
		return {
			_id: placeId
		};
	},
	placeUpdateOpeningHours: function(openingHours, placeId) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(placeId, String);
		check(openingHours, Array);
		for (var i = 0; i < openingHours.length; i++) {
			check(openingHours[i], Object);
			check(openingHours[i].d, String);
			check(openingHours[i].c, Match.Optional(Boolean));
			check(openingHours[i].e, Match.Optional(String));
			check(openingHours[i].s, Match.Optional(String));
		};

		var result = Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: placeId} ] }, { $set: {
			'openingHours': openingHours
		} });

		return {
			_id: placeId
		};
	},
	/**
	 * @summary 
	 */
	inviteStaffMembers: function (users) {
		
	}
});