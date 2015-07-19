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
		var place = _.extend(placeAttributes, {
			members: [{id: user._id, admin: true, staff: true}],
			activated: false,
			submittedBy: user._id,
			submittedAt: new Date()
		});
		place.loc = { lat: place.loc[0], lon: place.loc[1] };
		// Inster the post
		var placeId = Places.insert(place);

		// Notify the admin that he have a new place to validate by email
		Meteor.defer(function() {
			if (Meteor.isServer) {
				/*Email.send({
					to: "contact@pierre-mary.fr",
					from: "noreply@mapker.co",
					subject: "New place waiting for validation",
					html: "Hello dear moderator, <br>A place named " + place.name + " is waiting for your validation on <a href='http://mapker.co'>Mapker</a>.",
					text: "Hello dear moderator, \n\nA place named " + place.name + " is waiting for your validation on Mapker (http://mapker.co)."
			  });*/

				HTTP.call("POST", "https://mandrillapp.com/api/1.0/messages/send.json",
					{
						data: {
							"key": "OfKzISRCtJJLFJmGi-k9kA",
							"message": {
								'html': "Hello dear moderator, <br>A place named " + place.name + " is waiting for your validation on <a href='http://mapker.co'>Mapker</a>.",
								'text': "Hello dear moderator, \n\nA place named " + place.name + " is waiting for your validation on Mapker (http://mapker.co).",
								"subject": 'A new place is waiting for validation',
								"from_email": "noreply@example.com",
								"from_name": "Mapker",
								"to": [
									{ "email": 'pierre.mary10@gmail.com', "name": 'Pierre Mary', "type": "to" }
								],
								"headers": { "Reply-To": "noreply@example.com" },
								"important": false,"track_clicks": true,"auto_text": false,
								"auto_html": false,"merge": true,"merge_language": "mailchimp",
								"tags": [ "new-place" ]
							}, "async": false, "ip_pool": "Main Pool"
						}
					},
					function (error, result) {
						if (!error) console.log(error);
					});

				// Update the place ElasticSearch document
				Meteor.call('updatePlaceESDocument', placeId);
		  }
		});

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
	/**
	 * @summary Update the Name, specialities and types of a place
	 * @param {Object} place The place informations
	 */
	placeIdentityUpdate: function(place) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(place, {
			id: String,
			name: String,
			specialities: Array,
			types: Array,
		});

		if (Meteor.isServer) {
			// Check if the user have admin rights
			var isAdmin = Meteor.call('canUserEditPlace', place.id);

			if (isAdmin) {
				Places.update({_id: place.id}, { $set: {
					name: place.name,
					specialities: place.specialities,
					types: place.types
				} });

				// Update the place ElasticSearch document
				Meteor.call('updatePlaceESDocument', place.id);
			}
		}
	},
	/**
	 * @summary Update the place location
	 * @param {Object} place - The place location information to set in the db
	 */
	placeLocationUpdate: function(place) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(place, {
			id: String,
			streetNumber: String,
			streetName: String,
			city: String,
			zipcode: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array
		});

		if (Meteor.isServer) {
			// Check if the user have admin rights
			var isAdmin = Meteor.call('canUserEditPlace', place.id);

			if (isAdmin) {
				Places.update({_id: place.id}, { $set: {
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
			}
		}
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

		// Check if the user have admin rights
		var isAdmin = Meteor.call('canUserEditPlace', placeSocialProfiles.id);

		if (isAdmin) {
			if (Meteor.isServer) {
				Meteor.defer(function() {
					Places.update({_id: placeSocialProfiles.id}, { $set: {
						'links.facebook': placeSocialProfiles.facebook,
						'links.flickr': placeSocialProfiles.flickr,
						'links.twitter': placeSocialProfiles.twitter,
						'links.website': placeSocialProfiles.website
					} });

					// Update the place ElasticSearch document
					Meteor.call('updatePlaceESDocument', placeSocialProfiles.id);
				});
			}
		}
		else {
			return false;
		}

		return true;
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
	 * @summary Send an invitation email to the given users and email address
	 */
	invitePlaceStaffMembers: function (usersArray, placeId, message) {
		check(usersArray, Array);
		check(placeId, String);
		check(message, String);

		// Check if the user has the admin rigths over the place
		if (! Meteor.call('canUserEditPlace', placeId)) return false;

		// Get the user who send the invitation
		var user = Meteor.user();

		if (Meteor.isServer) {
			Meteor.defer(function() {
				// Get the place
				var place = Places.findOne({_id: placeId});

				// Get the users
				var users = [];
				for (var i = 0; i < usersArray.length; i++) {
					check(usersArray[i], {
						fullname: Match.Optional(String),
						email: Match.Optional(String),
						id: String
					});

					if (usersArray[i].fullname) {
							// Get the user email
							var newUser = Meteor.users.findOne({_id: usersArray[i].id});
							users.push( newUser ); // Add this user to the users array

							// Check if the user was already a member of the place and update him
							var alreadyMember = Places.findOne({_id: placeId, members: {$elemMatch: { id: newUser._id }} });
							if (alreadyMember) {
								// Update the member by setting the 'staff' to true
								Places.update({_id: placeId, members: {$elemMatch: { id: newUser._id }} }, { $set: { 'members.$.staff': true } });
							}
							else {
								// Add the user as member and set him staff to true
								Places.update({_id: placeId}, { $addToSet: { members: {id: newUser._id, staff: true} } });
							}
					}

					/* @todo Be able to send an invitation to an email address */
					// and generate a token to allow a the email owner to automaticaly
					// be linked with the place that invited him
					/*else if (users[i].email) {
							emails.push( users[i].email );
					}*/
				};

				// Send the emails
				for (var i = 0; i < users.length; i++) {
					var templateName = 'join-place-staff-en';
					var subject = user.profile.firstname + ' has indicated that you are a member of his staff of ' + place.name;
					var userAvatar = 'http://mapker.co/images/avatar-user-default.png';
					var placeAvatar = 'http://mapker.co/images/avatar-place-default.png';

					// Sanitize the message input if necessary
					if (message) {
						message = removeTags(message);
					}

					if (users[i].profile.address.countryCode == 'FR') {
						templateName = 'join-place-staff-fr';
						subject = user.profile.firstname + ' a indiqué que vous faites parti de l\'équipe de ' + place.name;
					}

					// Get the avatar of the user who send the invitation
					if (user.profile.avatar)
						userAvatar = user.profile.avatar.url;

					if (place.avatar)
						placeAvatar = place.avatar.url;

					HTTP.call("POST", "https://mandrillapp.com/api/1.0/messages/send-template.json",
		      	{
							data: {
						    "key": "OfKzISRCtJJLFJmGi-k9kA",
						    "template_name": templateName,
								"template_content": [],
						    "message": {
									"subject": subject,
			        		"from_email": "noreply@example.com",
			        		"from_name": "Mapker",
						      "to": [
						        { "email": users[i].emails[0].address, "name": users[i].profile.firstname, "type": "to" }
						      ],
						      "headers": { "Reply-To": "noreply@example.com" },
						      "important": false,"track_clicks": true,"auto_text": false,
						      "auto_html": false,"merge": true,"merge_language": "mailchimp",
						      "global_merge_vars": [
										{ "name": "USERAVATAR", "content": userAvatar },
										{ "name": "MESSAGE", "content": message },
										{ "name": "USERLINK", "content": 'http://mapker.co/user/' + users[i]._id + '/bio' },
										{ "name": "USERNAME", "content": user.profile.firstname },
										{ "name": "PLACEAVATAR", "content": placeAvatar },
										{ "name": "PLACELINK", "content": 'http://mapker.co/places/' + place._id + '/about' },
										{ "name": "PLACENAME", "content": place.name },
						      ], "tags": [ "welcome-mail" ]
						    }, "async": false, "ip_pool": "Main Pool"
							}
						},
	          function (error, result) {
	            if (!error) console.log(error);
	          });
				};
			});
		}
	}
});
