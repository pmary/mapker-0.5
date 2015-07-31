/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.methods({
	userCreateAccount: function (user) {
		check(user, {
			firstname: String,
			lastname: String,
			email: String,
			password: String,
			passwordConfirmation: String,
			userLang : String
		});

		// Prevent email sending when runing test
		if (user.email === 'noreply@mapker.co') {
			return false;
		}

		if (Meteor.isServer) {
			Meteor.defer(function() {
				var templateName = 'welcome-mail-en';
				var subject = 'Welcome on Mapker ' + user.firstname;

				// Define the template to user, acordingly to the browser langage
				if (user.userLang == 'fr') {
					templateName = 'welcome-mail-fr';
					subject = 'Bienvenue sur Mapker ' + user.firstname;
				}

				//console.log('template name: ', templateName);

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
					        { "email": user.email, "name": user.firstname, "type": "to" }
					      ],
					      "headers": { "Reply-To": "noreply@example.com" },
					      "important": false,"track_clicks": true,"auto_text": false,
					      "auto_html": false,"merge": true,"merge_language": "mailchimp",
					      "global_merge_vars": [
					        { "name": "FNAME", "content": user.firstname }
					      ], "tags": [ "welcome-mail" ]
					    }, "async": false, "ip_pool": "Main Pool"
						}
					},
					function (error, result) {
						if (error) Logger.log(error);
						Logger.log(result);
					});
			});
		}

    return true;
	},
	userCreateProfile: function (profileAttributes) {
		// Data check
		check(Meteor.userId(), String); // Check if the user is loged in
		check(profileAttributes, {
			activity: String,
			countryCode: String,
			zipcode: String,
			city: String,
			loc: Array
		});
		// Set complementary data
		var user = Meteor.user();
		var profile = _.extend(profileAttributes);
		// Inster the post
		var userId = Meteor.users.update(
			{_id: user._id},
			{ $set: {
				'profile.activity': profile.activity,
				'profile.address.countryCode': profile.countryCode,
				'profile.address.zipcode': profile.zipcode,
				'profile.address.city': profile.city,
				'profile.address.loc': profile.loc
			} });

		return {
			_id: userId
		};
	},
	userInsertCover: function (coverAttributes) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(coverAttributes, {
			url: String,
			name: String,
			focusX: Number,
			focusY: Number,
			w: Number,
			h: Number
		});
		// Set complementary data
		var user = Meteor.user();
		var cover = _.extend(coverAttributes);
		// Inster the post
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.cover': cover} });

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	userInsertAvatar: function (avatarAttributes) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(avatarAttributes, {
			url: String,
			name: String,
			focusX: Number,
			focusY: Number,
			w: Number,
			h: Number
		});
		// Set complementary data
		var user = Meteor.user();
		var avatar = _.extend(avatarAttributes);
		// Update the user avatar
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.avatar': avatar} });

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	userUpdateAvatar: function (avatarAttributes) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(avatarAttributes, {
			focusX: Number,
			focusY: Number
		});
		// Set complementary data
		var user = Meteor.user();
		var avatar = _.extend(avatarAttributes);
		// Inster the post
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.avatar.focusX': avatar.focusX, 'profile.avatar.focusY': avatar.focusY} });
		return {
			_id: userId
		};
	},
	userUpdateBio: function (userAttributes) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(userAttributes, {
			bio: String
		});
		var user = Meteor.user();
		var userdata = _.extend(userAttributes);
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.bio': userdata.bio} });
		return {
			_id: userId
		};
	},
	userAddSkill: function (userSkill) {
		check(Meteor.userId(), String);
		check(userSkill, String);
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $push: {'profile.skills': {'title': userSkill}  } });

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	userUpdateSkills: function (userSkills) {
		check(Meteor.userId(), String);
		check(userSkills, Array);
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.skills': userSkills  } });

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	userUpdateIdentity: function (userIdentity) {
		check(Meteor.userId(), String);
		check(userIdentity, {
			firstname: String,
			lastname: String,
			activity: String,
			countryCode: String,
			zipcode: String,
			city: String,
			loc: Array
		});
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {
			'profile.firstname': userIdentity.firstname,
			'profile.lastname': userIdentity.lastname,
			'profile.activity': userIdentity.activity,
			'profile.address.countryCode': userIdentity.countryCode,
			'profile.address.zipcode': userIdentity.zipcode,
			'profile.address.city': userIdentity.city,
			'profile.address.loc': userIdentity.loc
		} });

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {_id: userId};
	},
	userUpdateSocialProfiles: function (userSocialProfiles) {
		check(Meteor.userId(), String);
		check(userSocialProfiles, {
			facebook: String,
			flickr: String,
			twitter: String,
			linkedin: String,
			github: String,
			tumblr: String,
			instagram: String,
			behance: String,
			pinterest: String,
			vimeo: String,
			website: String
		});
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {
			'profile.links.facebook': userSocialProfiles.facebook,
			'profile.links.flickr': userSocialProfiles.flickr,
			'profile.links.twitter': userSocialProfiles.twitter,
			'profile.links.linkedin': userSocialProfiles.linkedin,
			'profile.links.github': userSocialProfiles.github,
			'profile.links.tumblr': userSocialProfiles.tumblr,
			'profile.links.instagram': userSocialProfiles.instagram,
			'profile.links.behance': userSocialProfiles.behance,
			'profile.links.pinterest': userSocialProfiles.pinterest,
			'profile.links.vimeo': userSocialProfiles.vimeo,
			'profile.links.website': userSocialProfiles.website
		} });
	},
	/**
	 * @summary Send a connection request to the given user
	 * @param {String} userId - The id of the user to wich send the request
	 * @see http://docs.mongodb.org/manual/reference/operator/update/addToSet/
	 * @returns The result of the MongoDB operation
	 */
	userSendConnexionRequest: function (userId) {
		check(Meteor.userId(), String);
		check(userId, String);

		var user = Meteor.user();

		// Check if we already have send a connexion request to this user
		if (user.profile.network && user.profile.network.users && user.profile.network.users.pending_requests) {
			if ( user.profile.network.users.pending_requests.indexOf(userId) > -1) return false;
		}

		// Update the 'pending_requests' field of the current user with the given id
		var pendingResult = Meteor.users.update({_id: user._id}, { $addToSet: {'profile.network.users.pending_requests': userId} });

		// Update the 'pending_reponses' field of the user to witch the request is addressed
		// And increment the unread_notifs field
		var notifResult =  Meteor.users.update(
			{_id: userId},
			{
				$addToSet: {
					'profile.network.users.pending_reponses': {
						'createdAt': new Date().toISOString(),
						'id': user._id,
			    	'name' : user.profile.fullname,
						'read': false
					}
				},
				$inc: {
					'profile.unread_notifs': 1
				}
			}
		);

		return pendingResult;
	},
	/**
	 * @summary Accept the connexion request of an user
	 * @param {String} userId - The id of the user who make the connexion request
	 */
	userAcceptConnexionRequest: function (userId) {
		check(Meteor.userId(), String);
		check(userId, String);

		var user = Meteor.user();

		// Update the 'connected' field of both the receiver and the emitter with their respective id
		Meteor.users.update( {_id: userId}, { $addToSet: { 'profile.network.users.connected': user._id }} ); // Emitter
		Meteor.users.update( {_id: user._id}, { $addToSet: { 'profile.network.users.connected': userId }} ); // Receiver

		// Remove the receiver id from the 'pending_requests' field of the emitter
		Meteor.users.update( {_id: userId}, { $pull: { 'profile.network.users.pending_requests': user._id }} );

		// Remove the connexion request of the emitter from the 'pending_reponses' field of the receiver
		Meteor.users.update( {_id: user._id}, { $pull: { 'profile.network.users.pending_reponses': { id: userId } }} );
	},
	/**
	 * @summary Cancel the connexion request the user previously made
	 */
	userCancelConnexionRequest: function (userId) {
		check(Meteor.userId(), String);
		check(userId, String);

		var user = Meteor.user();

		// Remove the receiver id from the 'pending_requests' field of the emitter
		Meteor.users.update( {_id: user._id}, { $pull: { 'profile.network.users.pending_requests': userId }} );

		// Remove the connexion request of the emitter from the 'pending_reponses' field of the receiver
		Meteor.users.update( {_id: userId}, { $pull: { 'profile.network.users.pending_reponses': { id: user._id } }} );
	},
	/**
	 * @summary Remove a user from the current user network by it's id
	 * @params {String} resourceId
	 * @see http://docs.mongodb.org/manual/reference/operator/update/pull/
	 */
	userUnConnect: function (userId) {
		check(Meteor.userId(), String);
		check(userId, String);

		var user = Meteor.user();

		// Remove the user id from the network of the current user
		var disconnect1Result = Meteor.users.update({_id: user._id}, {$pull: {'profile.network.users.connected': userId} });
		var disconnect2Result = Meteor.users.update({_id: userId}, {$pull: {'profile.network.users.connected': user._id} });

		return disconnect1Result;
	},
	/**
	 * @summary Mark all the user notifications as read
	 */
	userMarkNotifsAsRead: function () {
		check(Meteor.userId(), String);

		var user = Meteor.user();

		Meteor.users.update({_id: user._id}, { $set: { 'profile.unread_notifs': 0 } });
	}
});
