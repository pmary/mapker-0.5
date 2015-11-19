/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.methods({
	'mapker:users/userCreateAccount': function (user) {
		// Prevent email sending when runing test
		if (user.email === 'noreply@mapker.co') {
			return false;
		}

		check(user, {
			firstname: String,
			lastname: String,
			nicHandle: String,
			email: String,
			password: String,
			passwordConfirmation: String,
			userLang : String
		});

		// Try to insert the new nicHandle
		/*Meteor.call('mapker:nichandle/insert', {
			nicHandle: user.nicHandle,
			resourceId: userId,
			resourceType: 'user'
		});*/

		if (Meteor.isServer) {
			// Check if the nichandle already existe
			if (NicHandles.findOne({ canonicalName: user.nicHandle.toLowerCase() })) {
				return false;
			}
			else {
				var userId = Accounts.createUser({
					email: user.email,
					password: user.password,
					profile:{
						fullname: user.firstname+ " " + user.lastname,
						firstname: user.firstname,
						lastname: user.lastname,
						nicHandle: user.nicHandle
					}
				});

				// Insert a new nicHandle
				NicHandles.insert({
					name: user.nicHandle,
					canonicalName: user.nicHandle.toLowerCase(),
					resourceId: userId,
					resourceType: 'user'
				});

				// Send an email with a link the user can use to verify his or her email address.
				Accounts.sendVerificationEmail(userId);
			}
		}

		if (Meteor.isClient) {
			Router.go('Home');
			sAlert.success('A verification email has been sent to you with instructions to activate your account.', {onRouteClose: false});
		}

		//var userId = Meteor.user()._id;

		Meteor.defer(function() {
			if (Meteor.isServer) {
				/*var templateName = 'welcome-mail-en';
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
				});*/
			}
		});

		return true;
	},
	'mapker:users/preCreateAccount': function (email, profile) {
		check(email, String);
		check(profile, Object);

		// Create the account with the given profile
		var newUser = Accounts.createUser(
			{ email: email, /*password: user.password,*/ profile: profile }
		);

		return newUser;
	},
	/**
	 * @summary Activate a pre-created account by updating the password
	 * and his profile if necessary.
	 * The account is activated if the given email and tokens match
	 * @param {String} token - The auth token required to acivate the account
	 * @param {Object} user - The firstname, lastname and password of the user
	 */
	'mapker:users/activatePreCreatedAccount': function (token, user) {
		check(token, String);
		check(user, {
			firstname: String,
			lastname: String,
			email: String,
			password: String,
			passwordConfirmation: String,
			userLang : String
		});

		// Check if the given token and email match with the pre-created account
		var isMatching = Meteor.users.findOne(
			{
				emails: { $elemMatch: { address: user.email } },
				activationToken: token
			}
		);

		if (isMatching) {
			// Update the user profile and remove the token
			Meteor.users.update({ _id: isMatching._id },
				{
					$set: {
						'profile.firstname': user.firstname,
						'profile.lastname': user.lastname
					},
					$unset: {
						activationToken: ''
					}
				}
			);

			// Change the password by the given one
			return Accounts.setPassword(isMatching._id, user.password);
		}
		else {
			console.log('User account can\'t be activated');
			return false;
		}
	},
	'mapker:users/createProfile': function (profileAttributes) {
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
				'profile.address.loc': { lat: profile.loc[0], lon: profile.loc[1] }
			} }
		);

		// Update the user ElasticSearch document
		Meteor.call('mapker:search/updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	'mapker:users/bioUpdate': function (userAttributes) {
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
	'mapker:users/addSkill': function (userSkill) {
		check(Meteor.userId(), String);
		check(userSkill, String);
		var user = Meteor.user();
		var updateResult;
		if (user && user._id) {
			updateResult = Meteor.users.update({_id: user._id}, { $push: {'profile.skills': {'title': userSkill}  } });
		}

		// Update the user ElasticSearch document
		Meteor.call('mapker:search/updateUserESDocument', Meteor.userId());

		return updateResult;
	},
	'mapker:users/skillsUpdate': function (userSkills) {
		check(Meteor.userId(), String);
		check(userSkills, Array);
		var user = Meteor.user();
		var updateResult = Meteor.users.update({_id: user._id}, { $set: {'profile.skills': userSkills  } });

		// Update the user ElasticSearch document
		Meteor.call('mapker:search/updateUserESDocument', Meteor.userId());

		return updateResult;
	},
	'mapker:users/locationUpdate': function (userLocation) {
		check(Meteor.userId(), String);
		check(userLocation, {
			countryCode: String,
			zipcode: String,
			city: String,
			loc: Array
		});

		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {
			'profile.address.countryCode': userLocation.countryCode,
			'profile.address.zipcode': userLocation.zipcode,
			'profile.address.city': userLocation.city,
			'profile.address.loc': { lat: userLocation.loc[0], lon: userLocation.loc[1] }
		} });

		// Update the user ElasticSearch document
		Meteor.call('mapker:search/updateUserESDocument', Meteor.userId());

		return {_id: userId};
	},
	'mapker:users/identityUpdate': function (userIdentity) {
		check(Meteor.userId(), String);
		check(userIdentity, {
			firstname: String,
			lastname: String,
			activity: String
		});
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {
			'profile.firstname': userIdentity.firstname,
			'profile.lastname': userIdentity.lastname,
			'profile.fullname': userIdentity.firstname + ' ' + userIdentity.lastname,
			'profile.activity': userIdentity.activity
		} });

		// Update the user ElasticSearch document
		Meteor.call('mapker:search/updateUserESDocument', Meteor.userId());

		return {_id: userId};
	},
	'mapker:users/socialProfilesUpdate': function (userSocialProfiles) {
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

		return userId;
	},
	/**
	 * @summary Send a connection request to the given user
	 * @param {String} userId - The id of the user to wich send the request
	 * @see http://docs.mongodb.org/manual/reference/operator/update/addToSet/
	 * @returns The result of the MongoDB operation
	 */
	'mapker:users/sendConnexionRequest': function (userId) {
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
	'mapker:users/acceptConnexionRequest': function (userId) {
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
	 * @summary Deny the connexion request of an user
	 * @param {String} userId - The id of the user who make the connexion request
	 */
	'mapker:users/denyConnexionRequest': function (userId) {
		check(Meteor.userId(), String);
		check(userId, String);

		var user = Meteor.user();

		// Remove the receiver id from the 'pending_requests' field of the emitter
		Meteor.users.update( {_id: userId}, { $pull: { 'profile.network.users.pending_requests': user._id }} );

		// Remove the connexion request of the emitter from the 'pending_reponses' field of the receiver
		Meteor.users.update( {_id: user._id}, { $pull: { 'profile.network.users.pending_reponses': { id: userId } }} );
	},
	/**
	 * @summary Cancel the connexion request the user previously made
	 */
	'mapker:users/cancelConnexionRequest': function (userId) {
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
	'mapker:users/unconnect': function (userId) {
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
	},
	/**
	 * @summary Get the necessary informations of the differents identities of the
	 * current user and return them into the form of formated objects in an array.
	 * An identity can be, the user itself or place and communities the user own.
	 *
	 * @return {Array} identities
	 * @return {}
	 */
	'mapker:users/getUserIdentities': function () {

	}
});
