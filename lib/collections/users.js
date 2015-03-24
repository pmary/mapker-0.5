Meteor.methods({
	userCreateProfile: function(profileAttributes) {
		// Data check
		check(Meteor.userId(), String); // Check if the user is loged in
		check(profileAttributes, {
			activity: String,
			countryCode: String,
			zipcode: String
		});
		// Set complementary data
		var user = Meteor.user();
		var profile = _.extend(profileAttributes);
		// Inster the post
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.activity': profile.activity, 'profile.countryCode': profile.countryCode, 'profile.zipcode': profile.zipcode} });
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
		return {
			_id: userId
		};
	},
	userUpdateCover: function(coverAttributes) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(coverAttributes, {
			focusX: Number,
			focusY: Number
		});
		// Set complementary data
		var user = Meteor.user();
		var cover = _.extend(coverAttributes);
		// Inster the post
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.cover.focusX': cover.focusX, 'profile.cover.focusY': cover.focusY} });
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
		// Inster the post
		var userId = Meteor.users.update({_id: user._id}, { $set: {'profile.avatar': avatar} });
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
});

validateUserJoin = function (user) {
	var errors = {};

	var firstnameError = nameValidation(user.firstname);
	if (firstnameError) {
		errors.firstname = firstnameError;
	}

	var lastnameError = nameValidation(user.lastname);
	if (lastnameError) {
		errors.lastname = lastnameError;
	}

	var emailError = emailValidation(user.email);
	if (emailError) {
		errors.email = emailError;
	}

	var passwordError = passwordValidation(user.password);
	if (passwordError) {
		errors.password = passwordError;
	}

	var passwordConfirmationError = matchingValidation(user.password, user.passwordConfirmation);
	if (passwordConfirmationError) {
		errors.passwordConfirmation = passwordConfirmationError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserLogin = function (credentials) {
	var errors = {};

	var emailError = emailValidation(credentials.email);
	if (emailError) {
		errors.email = emailError;
	}

	var passwordError = isFilledValidation(credentials.password);
	if (passwordError) {
		console.log(passwordError);
		errors.password = passwordError;
	};

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateUserForgotPassword = function (credentials) {
	var errors = {};

	var emailError = emailValidation(credentials.email);
	if (emailError) {
		errors.email = emailError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

validateAddProfile = function (profile) {
	var errors = {};

	var activityError = isFilledValidation(profile.activity);
	if (activityError) {
		errors.activity = activityError;
	}

	var zipcodeError = isFilledValidation(profile.zipcode);
	if (zipcodeError) {
		errors.zipcode = zipcodeError;
	}

	var countryCodeError = isFilledValidation(profile.countryCode);
	if (zipcodeError) {
		errors.countryCode = countryCodeError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}

