/*****************************************************************************/
/* Methods */
/*****************************************************************************/
Meteor.methods({
	userCreateProfile: function(profileAttributes) {
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

		// Update the user ElasticSearch document
		Meteor.call('updateUserESDocument', Meteor.userId());

		return {
			_id: userId
		};
	},
	userInsertCover: function(coverAttributes) {
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
	userInsertAvatar: function(avatarAttributes) {
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
	userUpdateAvatar: function(avatarAttributes) {
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
	userUpdateBio: function(userAttributes) {
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
	userAddSkill: function(userSkill) {
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
	userUpdateSkills: function(userSkills) {
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
	userUpdateIdentity: function(userIdentity) {
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
	userUpdateSocialProfiles: function(userSocialProfiles) {
		check(Meteor.userId(), String);
		check(userSocialProfiles, {
			facebook: String,
			flickr: String,
			twitter: String,
			website: String
		});
		var user = Meteor.user();
		var userId = Meteor.users.update({_id: user._id}, { $set: {
			'profile.links.facebook': userSocialProfiles.facebook,
			'profile.links.flickr': userSocialProfiles.flickr,
			'profile.links.twitter': userSocialProfiles.twitter,
			'profile.links.website': userSocialProfiles.website
		} });
	},
	/**
	 * @summary Add the given user id to the followed list of the current user,
	 * update the followed user 'followers' field and notify him
	 * @params {String} resourceId
	 * @see http://docs.mongodb.org/manual/reference/operator/update/addToSet/
	 * @returns The result of the MongoDB operation
	 */
	userFollow: function(resourceId) {
		check(Meteor.userId(), String);
		check(resourceId, String);

		var user = Meteor.user();

		// Update the 'followed' field of the current user with the given id
		var followedResult = Meteor.users.update({_id: user._id}, { $addToSet: {'profile.network.users.followed': resourceId} });

		// Update the 'followers' field of the newsly followed user with the current user id
		var followersResult = Meteor.users.update({_id: resourceId}, { $addToSet: {'profile.network.users.followers': user._id} });

		// Push a follow notification to the newsly followed user
		var notifResult = Notifications.insert({
			'createdAt': new Date().toISOString(),
			'action': 'followed',
			'from': {
				'resource': 'users',
				'id': Meteor.userId(),
			},
			'to': resourceId,
			'msg': '<a href="/user/' + user._id + '/bio">' + user.profile.fullname + '</a> followed you',
			'read': false
		});

		return followedResult;
	},
	/**
	 * @summary Unfollow an user by it's id
	 * @params {String} resourceId
	 * @see http://docs.mongodb.org/manual/reference/operator/update/pull/
	 */
	userUnfollow: function(resourceId) {
		check(Meteor.userId(), String);
		check(resourceId, String);

		var user = Meteor.user();

		// Remove the user id from the network of the current user
		var unfollowResult = Meteor.users.update({_id: user._id}, {$pull: {'profile.network.users.followed': resourceId} });

		return unfollowResult;
	},
	/**
	 * @summary Mark all the user notifications as read
	 */
	userMaskNotifsAsRead: function() {
		Notifications.update({read: false}, {$set: {read: true}}, {multi: true});
	}
});


/*****************************************************************************/
/* Fields validations */
/*****************************************************************************/
validateUserJoin = function(user) {
	var errors = {};

	var firstnameError = nameValidation(user.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = nameValidation(user.lastname);
	if (lastnameError) { errors.lastname = lastnameError; }

	var emailError = emailValidation(user.email);
	if (emailError) { errors.email = emailError; }

	var passwordError = passwordValidation(user.password);
	if (passwordError) { errors.password = passwordError; }

	var passwordConfirmationError = matchingValidation(user.password, user.passwordConfirmation);
	if (passwordConfirmationError) { errors.passwordConfirmation = passwordConfirmationError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserLogin = function(credentials) {
	var errors = {};

	var emailError = emailValidation(credentials.email);
	if (emailError) { errors.email = emailError; }

	var passwordError = isFilledValidation(credentials.password);
	if (passwordError) { errors.password = passwordError; };

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserForgotPassword = function(credentials) {
	var errors = {};

	var emailError = emailValidation(credentials.email);
	if (emailError) { errors.email = emailError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateAddProfile = function(profile) {
	var errors = {};

	var activityError = isFilledValidation(profile.activity);
	if (activityError) { errors.activity = activityError; }

	var zipcodeError = isFilledValidation(profile.zipcode);
	if (zipcodeError) { errors.zipcode = zipcodeError; }

	var countryCodeError = isFilledValidation(profile.countryCode);
	if (zipcodeError) { errors.countryCode = countryCodeError; }

	var cityError = isFilledValidation(profile.city);
	if (cityError) { errors.city = cityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserAddSkill = function(skill, skills) {
	var errors = {};

	var skillError = isFilledValidation(skill);
	if (skillError) { errors.skill = skillError; }

	if (skills && skills.length) {
		var duplicateSkillError = isDuplicateSkillValidation(skill, skills);
		if (duplicateSkillError) { errors.skill = duplicateSkillError; }
	};

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserIdentity = function(identity) {
	var errors = {};

	var firstnameError = nameValidation(identity.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = nameValidation(identity.lastname);
	if (lastnameError) { errors.lastname = lastnameError; }
	
	var activityError = isFilledValidation(identity.activity);
	if (activityError) { errors.activity = activityError; }

	var zipcodeError = isFilledValidation(identity.zipcode);
	if (zipcodeError) { errors.zipcode = zipcodeError; }

	var countryCodeError = isFilledValidation(identity.countryCode);
	if (countryCodeError) { errors.countryCode = countryCodeError; }

	var cityError = isFilledValidation(identity.city);
	if (cityError) { errors.city = cityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUsersocialProfiles = function(socialProfiles) {
	var errors = {};

	if (socialProfiles.facebook) {
		var facebookCodeError = urlValidation(socialProfiles.facebook);
		if (facebookCodeError) { errors.facebook = facebookCodeError };
	};

	if (socialProfiles.flickr) {
		var flikrCodeError = urlValidation(socialProfiles.flickr);
		if (flikrCodeError) { errors.flickr = flikrCodeError };
	};

	if (socialProfiles.twitter) {
		var twitterCodeError = urlValidation(socialProfiles.twitter);
		if (twitterCodeError) { errors.twitter = twitterCodeError };
	};

	if (socialProfiles.website) {
		var websiteCodeError = urlValidation(socialProfiles.website);
		if (websiteCodeError) { errors.website = websiteCodeError };
	};

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}