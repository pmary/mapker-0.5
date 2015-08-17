Meteor.methods({
	placeInsert: function (placeAttributes) {
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

		// Update the user
		var userUpdate = Meteor.users.update(
			{_id: user._id},
			{
				$addToSet: {
					'profile.network.places': {
						id: placeId,
						admin: true
					}
				}
			}
		);

		// Notify the admin that he have a new place to validate by email
		Meteor.defer(function () {
			if (Meteor.isServer) {
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
	adminPlaceEdit: function (placeAttributes) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, Object);
		check(placeAttributes.place, {
			_id: String,
			administrators: Array,
			name: String
		});

		if (placeAttributes.activated) {
			check(placeAttributes.activated, Boolean);
		}

		var place = _.extend(placeAttributes.place);
		var placeId;
		if (placeAttributes.activated) {
			console.log("the place will be activated");
			placeId = Places.update({_id: place._id}, { $set: {activated: placeAttributes.activated, name: place.name} });
		}else {
			placeId = Places.update({_id: place._id}, { $set: {name: place.name} });
		}

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
				}
			}

	    }
	},
	/**
	 * @summary Update the Name, specialities and types of a place
	 * @param {Object} place The place informations
	 */
	placeIdentityUpdate: function (place) {
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
	placeLocationUpdate: function (place) {
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
	placeUpdateSocialProfiles: function (placeSocialProfiles) {
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
				Meteor.defer(function () {
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
	placeUpdateAbout: function (place) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(place, {
			id: String,
			about: String
		});

    if (Meteor.isServer) {
      // Check if the user have admin rights
      var isAdmin = Meteor.call('canUserEditPlace', place.id);

      if (isAdmin) {
    		var placeId = Places.update(
          {_id: place.id},
          { $set: { 'about': Mapker.utils.removeTags(place.about)} }
        );
    		return {
    			_id: placeId
    		};
      }
    }
	},
	placeUpdateOpeningHours: function (openingHours, placeId) {
		//console.log('placeUpdateOpeningHours openingHours', openingHours);
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
		}

		if (Meteor.isServer) {
			// Check if the user have admin rights
			var isAdmin = Meteor.call('canUserEditPlace', placeId);

			if (isAdmin) {
				var result = Places.update({_id: placeId}, { $set: {
					'openingHours': openingHours
				} });

				return true;
			}
			else {
				return false;
			}
		}
	},
	/**
	 * @summary Send an invitation email to the given users and email address
	 */
	invitePlaceStaffMembers: function (itemsArray, placeId, message) {
		check(itemsArray, Array);
		check(placeId, String);
		check(message, String);

		// Check if the user has the admin rigths over the place
		if (! Meteor.call('canUserEditPlace', placeId)) {
			return false;
		}

		// Get the user who send the invitation
		var user = Meteor.user();

		if (Meteor.isServer) {
			Meteor.defer(function () {
				// Get the place
				var place = Places.findOne({_id: placeId});

				// Get the users
				var users = [];
				var emails = [];
				var alreadyMember;

				for (var y = 0; y < itemsArray.length; y++) {
					/*check(itemsArray[y], {
						fullname: Match.Optional(String),
						email: Match.Optional(String),
						id: String
					});*/

					// If its a user already registered, add him to the staff
					// and send him a notification
					if (itemsArray[y].type === 'user') {
						// Get the user email
						var newUser = Meteor.users.findOne({_id: itemsArray[i].id});
						users.push( newUser ); // Add this user to the users array

						// Check if the user was already a member of the place and update him
						alreadyMember = Places.findOne({_id: placeId, members: {$elemMatch: { id: newUser._id }} });
						if (alreadyMember) {
							// Update the member by setting the 'staff' to true
							Places.update(
								{_id: placeId, members: {$elemMatch: { id: newUser._id }} },
								{
									$set: {
										'members.$.staff': true,
										'members.$.role': itemsArray[y].role
									}
								}
							);
						}
						else {
							// Add the user as member and set him staff to true
							Places.update(
								{_id: placeId},
								{
									$addToSet: {
										members: {
											id: newUser._id,
											staff: true,
											role: itemsArray[y].role
										}
									}
								}
							);
						}
					}
					// If its just an email, pre-create an account with a activation token
					// and send him an invitation to register with a link
					else if (itemsArray[y].type === 'email') {
						// Check that the email isn't already associated to an account
						var existingAccount = Meteor.users.findOne({ emails: { $elemMatch: { address: itemsArray[y].email } } });

						// If it exist, add him to the place staff
						// and send him a notification email
						if (existingAccount) {
							console.log('existingAccount: ', existingAccount);
							users.push( existingAccount ); // Add this user to the users array

							// Check if the user was already a member of the place and update him
							alreadyMember = Places.findOne({_id: placeId, members: {$elemMatch: { id: existingAccount._id }} });
							if (alreadyMember) {
								// Update the member by setting his role and 'staff' to true
								Places.update(
									{_id: placeId, members: {$elemMatch: { id: existingAccount._id }} },
									{ $set:
										{
											'members.$.staff': true,
											'members.$.role': itemsArray[y].role
										}
									}
								);
							}
							else {
								// Add the user as member and set him staff to true
								Places.update(
									{_id: placeId},
									{
										$addToSet: {
											members: {
												id: existingAccount._id,
												staff: true,
												role: itemsArray[y].role
											}
										}
									}
								);
							}
						}
						// Else, pre-create a new account
						else {
							var profile = {
								fullname: itemsArray[y].firstname + itemsArray[y].lastname,
								firstname: itemsArray[y].firstname,
								lastname: itemsArray[y].lastname,
								network: {
									places: [
										{
											id: placeId,
											staff: true,
											role: itemsArray[y].role
										}
									]
								}
							};

							// Pre-create the account
							var newUserId = Meteor.call('userPreCreateAccount', itemsArray[y].email, profile);
							// Add him an activation token
							var activationToken = Core.randomString(32) + (new Date().getTime()) + placeId;
							Meteor.users.update({_id: newUserId}, {$set: {activationToken: activationToken}});
							console.log('newUserId', newUserId);

							// Add the new user as member of the place and set him staff to true
							Places.update(
								{_id: placeId},
								{
									$addToSet: {
										members: {
											id: newUserId,
											staff: true,
											role: itemsArray[y].role
										}
									}
								}
							);

							// Set the activation url
							itemsArray[y].activationUrl = 'http://mapker.co/join/' + activationToken + '/' + itemsArray[y].email + '/' + itemsArray[y].firstname + '/' + itemsArray[y].lastname;
							//console.log('activation url: http://mapker.co/join/' + activationToken + '/' + itemsArray[y].email + '/' + itemsArray[y].firstname + '/' + itemsArray[y].lastname);
							emails.push(itemsArray[y]); // Add this user to the emails array
						}
					}
				}

				// Send the notification emails
				var i = 0;
				var templateName;
				var subject;
				var userAvatar = 'http://mapker.co/images/avatar-user-default.png';
				var placeAvatar = 'http://mapker.co/images/avatar-place-default.png';

				for (i = 0; i < users.length; i++) {
					templateName = 'join-place-staff-en';
					subject = user.profile.firstname + ' has indicated that you are a staff member of ' + place.name;

					// Sanitize the message input if necessary
					if (message) {
						message = Mapker.utils.removeTags(message);
					}

					if (users[i].profile.address.countryCode == 'FR') {
						templateName = 'join-place-staff-fr';
						subject = user.profile.firstname + ' a indiqué que vous faites parti de l\'équipe de ' + place.name;
					}

					// Get the avatar of the user who send the invitation
					if (user.profile.avatar) {
						userAvatar = user.profile.avatar.url;
					}

					if (place.avatar) {
						placeAvatar = place.avatar.url;
					}

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
										{ "name": "USERLINK", "content": 'http://mapker.co/user/' + user._id + '/bio' },
										{ "name": "USERNAME", "content": user.profile.firstname },
										{ "name": "PLACEAVATAR", "content": placeAvatar },
										{ "name": "PLACELINK", "content": 'http://mapker.co/places/' + place._id + '/about' },
										{ "name": "PLACENAME", "content": place.name },
						      ], "tags": [ "welcome-mail" ]
						    }, "async": false, "ip_pool": "Main Pool"
							}
						});
				}

				for (i = 0; i < emails.length; i++) {
					templateName = 'invitation-to-join-place-staff-en';
					subject = user.profile.firstname + ' invite you to join the team of ' + place.name;

					// Sanitize the message input if necessary
					if (message) {
						message = Mapker.utils.removeTags(message);
					}

					if (user.profile.address.countryCode == 'FR') {
						templateName = 'invitation-to-join-place-staff-fr';
						subject = user.profile.firstname + ' vous invite à rejoindre l\'équipe de ' + place.name;
					}

					if (place.avatar) {
						placeAvatar = place.avatar.url;
					}

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
						        { "email": emails[i].email, "name": emails[i].firstname, "type": "to" }
						      ],
						      "headers": { "Reply-To": "noreply@example.com" },
						      "important": false,"track_clicks": true,"auto_text": false,
						      "auto_html": false,"merge": true,"merge_language": "mailchimp",
						      "global_merge_vars": [
										{ "name": "USERAVATAR", "content": userAvatar },
										{ "name": "MESSAGE", "content": message },
										{ "name": "USERLINK", "content": 'http://mapker.co/user/' + user._id + '/bio' },
										{ "name": "USERNAME", "content": user.profile.firstname },
										{ "name": "PLACEAVATAR", "content": placeAvatar },
										{ "name": "PLACELINK", "content": 'http://mapker.co/places/' + place._id + '/about' },
										{ "name": "PLACENAME", "content": place.name },
										{ "name": "JOINLINK", "content": emails[i].activationUrl },
						      ], "tags": [ "welcome-mail" ]
						    }, "async": false, "ip_pool": "Main Pool"
							}
						});
				}
			});
		}
	},
	/**
	 * @summary Remove the user from the staff
	 */
	place_userLeaveStaff: function (placeId) {
		check(placeId, String);

		var user = Meteor.user();

		// Update the place
		Places.update(
			{_id: placeId, members: {$elemMatch: { id: user._id }} },
			{ $unset:
				{
					'members.$.staff': '',
					'members.$.role': ''
				}
			}
		);

		// Update the user
		//Meteor.users.update({_id: user._id});
	}
});
