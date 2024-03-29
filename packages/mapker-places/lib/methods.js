Meteor.methods({
	'mapker:places/insert': function (placeAttributes, phone, role) {
		// Data check
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, {
			specialities: Array,
			city: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array,
			name: String,
			streetName: String,
			streetNumber: String,
			types: Array,
			zipcode: String
		});
		check(role, String);
		check(phone, String);
		// Set complementary data
		var user = Meteor.user();
		var place = _.extend(placeAttributes, {
			members: [{id: user._id, admin: true, staff: true, role: role}],
			activated: false,
			submittedBy: user._id,
			submittedAt: new Date()
		});
		place.loc = { lat: place.loc[0], lon: place.loc[1] };

		// Insert the post
		var placeId = Places.insert(place);

		// Update the user
		var userUpdate = Meteor.users.update(
			{_id: user._id},
			{
				$set: {'profile.phone': phone},
				$addToSet: {
					'profile.network.places': {
						id: placeId,
						admin: true,
						role: role
					}
				}
			}
		);

		// Notify the admin that he have a new place to validate by email
		Meteor.defer(function () {
			if (Meteor.isServer) {
				// Send an email to the admin to notify him that a new place has been submited
				HTTP.call("POST", "https://mandrillapp.com/api/1.0/messages/send.json", {
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

				// Send an email to the client to notify him that his submission has been taken in account
				var templateName = 'consideration-of-the-request-to-add-a-place-en',
				subject = user.profile.firstname + ', your request to add place has been taken into account';
				if (
					user.profile.address &&
					user.profile.address.countryCode &&
					user.profile.address.countryCode === 'fr'
				) {
					templateName = 'consideration-of-the-request-to-add-a-place-fr';
					subject = user.profile.firstname + ', votre demande d\'ajout de lieu a bien été prise en compte';
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
		        		"from_name": "The Mapker Team",
					      "to": [
					        { "email": user.emails[0].address, "name": user.firstname, "type": "to" }
					      ],
					      "headers": { "Reply-To": "noreply@example.com" },
					      "important": false,"track_clicks": true,"auto_text": false,
					      "auto_html": false,"merge": true,"merge_language": "mailchimp",
					      "global_merge_vars": [
					        { "name": "USERNAME", "content": user.profile.firstname },
									{ "name": "PLACENAME", "content": place.name },
									{ "name": "PLACELINK", "content": "http://mapker.co/places/" + placeId + "/about"}
					      ], "tags": [ "consideration-of-the-request-to-add-a-place" ]
					    }, "async": false, "ip_pool": "Main Pool"
						}
					},
					function (error, result) {
						if (error) {
							console.log(error);
						}
					});
		  }
		});

		return {
			_id: placeId
		};
	},
	'mapker:places/adminEdit': function (placeAttributes) {
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
	'mapker:places/identityUpdate': function (place) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(place, {
			id: String,
			name: String,
			specialities: Array,
			types: Array,
		});

		if (Meteor.isServer) {
			// Check if the user have admin rights
			var isAdmin = Meteor.call('mapker:core/canUserEditPlace', place.id);

			if (isAdmin) {
				Places.update({_id: place.id}, { $set: {
					name: place.name,
					specialities: place.specialities,
					types: place.types
				} });
			}
		}
	},
	/**
	 * @summary Update the place location
	 * @param {Object} place - The place location information to set in the db
	 */
	'mapker:places/locationUpdate': function (place) {
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
			var isAdmin = Meteor.call('mapker:core/canUserEditPlace', place.id);

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
			}
		}
	},
	'mapker:places/updateSocialProfiles': function (placeSocialProfiles) {
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
		var isAdmin = Meteor.call('mapker:core/canUserEditPlace', placeSocialProfiles.id);

		if (isAdmin) {
			if (Meteor.isServer) {
				Meteor.defer(function () {
					Places.update({_id: placeSocialProfiles.id}, { $set: {
						'links.facebook': placeSocialProfiles.facebook,
						'links.flickr': placeSocialProfiles.flickr,
						'links.twitter': placeSocialProfiles.twitter,
						'links.website': placeSocialProfiles.website
					} });
				});
			}
		}
		else {
			return false;
		}

		return true;
	},
	'mapker:places/pdateAbout': function (place) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(place, {
			id: String,
			about: String
		});

    if (Meteor.isServer) {
      // Check if the user have admin rights
      var isAdmin = Meteor.call('mapker:core/canUserEditPlace', place.id);

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
	'mapker:places/updateOpeningHours': function (openingHours, placeId) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(placeId, String);
		check(openingHours, Object);
		check(openingHours.comment, String);
		check(openingHours.days, Array);
		for (var i = 0; i < openingHours.days.length; i++) {
			check(openingHours.days[i], Object);
			check(openingHours.days[i].day, String);
			check(openingHours.days[i].closed, Match.Optional(Boolean));
			if (openingHours.days[i].slot1) {
				check(openingHours.days[i].slot1, { from: String, to: String });
			}
			if (openingHours.days[i].slot2) {
				check(openingHours.days[i].slot2, { from: String, to: String });
			}
		}

		if (Meteor.isServer) {
			// Check if the user have admin rights
			var isAdmin = Meteor.call('mapker:core/canUserEditPlace', placeId);

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
	'mapker:places/inviteStaffMembers': function (itemsArray, placeId, message) {
		check(itemsArray, Array);
		check(placeId, String);
		check(message, String);

		// Check if the user has the admin rigths over the place
		if (! Meteor.call('mapker:core/canUserEditPlace', placeId)) {
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
					// If its a user already registered, add him to the staff
					// and send him a notification
					if (itemsArray[y].type === 'user') {
						// Get the user email
						var newUser = Meteor.users.findOne({_id: itemsArray[y].id});
						users.push( newUser ); // Add this user to the users array

						// Check if the user was already a member of the place and update him
						alreadyMember = Places.findOne({_id: placeId, members: {$elemMatch: { id: newUser._id }} });

						if (alreadyMember) {
							console.log('alreadyMember');
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

							// Update the user
							Meteor.users.update(
								{_id: newUser._id, 'profile.network.places.id': placeId},
								{ $set:
									{
										'profile.network.places.$.staff': true,
										'profile.network.places.$.role': itemsArray[y].role
									}
								}
							);
						}
						else {
							console.log('not alreadyMember');
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

							// Update the user
							Meteor.users.update(
								{_id: newUser._id},
								{
									$addToSet: {
										'profile.network.places': {
											id: placeId,
											'staff': true,
											'role': itemsArray[y].role
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
								// Update the user
								Meteor.users.update(
									{_id: existingAccount._id, 'profile.network.places.id': placeId},
									{ $set:
										{
											'profile.network.places.$.staff': true,
											'profile.network.places.$.role': itemsArray[y].role
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
								// Update the user
								Meteor.users.update(
									{_id: existingAccount._id},
									{
										$addToSet: {
											'profile.network.places': {
												id: placeId,
												'staff': true,
												'role': itemsArray[y].role
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
							var newUserId = Meteor.call('mapker:users/preCreateAccount', itemsArray[y].email, profile);
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
	'mapker:places/leaveStaff': function (placeId) {
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
		// Update the user profile
		Meteor.users.update(
			{_id: user._id, 'profile.network.places.id': placeId},
			{ $unset:
				{
					'profile.network.places.$.staff': '',
					'profile.network.places.$.role': ''
				}
			}
		);
	},
	/**
	 * @summary As admin, remove the given member from the staff
	 * @param {String} placeId - The id of the place
	 * @param {String} userId - The id of the user to remove from the staff
	 */
	'mapker:places/adminRemoveStaffMember': function (placeId, userId) {
		check(placeId, String);
		check(userId, String);

		// Check if the user have admin rights
		var isAdmin = Meteor.call('mapker:core/canUserEditPlace', placeId);

		if (isAdmin) {
			// Remove the user from the place
			Places.update(
				{_id: placeId, members: {$elemMatch: { id: userId }} },
				{ $unset:
					{
						'members.$.staff': '',
						'members.$.role': ''
					}
				}
			);

			// Update the user profile
			Meteor.users.update(
				{_id: userId, 'profile.network.places.id': placeId},
				{ $unset:
					{
						'profile.network.places.$.staff': '',
						'profile.network.places.$.role': ''
					}
				}
			);
		}
		else {
			return false;
		}
	},
	/**
	 * @summary Save the new role of the staff member
	 */
	'mapker:places/updateStaffMemberRole': function (role, userId, placeId) {
		check(role, String);
		check(placeId, String);
		check(userId, String);

		// @todo Update the user role
		// Check if the user have admin rights
		var isAdmin = Meteor.call('mapker:core/canUserEditPlace', placeId);

		if (isAdmin) {
			// Update the member in the place document
			Places.update(
				{_id: placeId, members: {$elemMatch: { id: userId }} },
				{ $set:
					{
						'members.$.role': role
					}
				}
			);

			// Update the place in the member document
			Meteor.users.update(
				{_id: userId, 'profile.network.places.id': placeId},
				{ $set:
					{
						'profile.network.places.$.role': role
					}
				}
			);
		}
		else {
			return false;
		}
	}
});
