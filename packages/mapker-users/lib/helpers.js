/*****************************************************************************/
/* Fields validations */
/*****************************************************************************/
Users.validateUserJoin = function (user) {
	var errors = {};

	var firstnameError = Core.nameValidation(user.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = Core.nameValidation(user.lastname);
	if (lastnameError) { errors.lastname = lastnameError; }

	var emailError = Core.emailValidation(user.email);
	if (emailError) { errors.email = emailError; }

	var passwordError = Core.passwordValidation(user.password);
	if (passwordError) { errors.password = passwordError; }

	var passwordConfirmationError = Core.matchingValidation(user.password, user.passwordConfirmation);
	if (passwordConfirmationError) { errors.passwordConfirmation = passwordConfirmationError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};

Users.validateUserLogin = function (credentials) {
	var errors = {};

	var emailError = Core.emailValidation(credentials.email);
	if (emailError) { errors.email = emailError; }

	var passwordError = isFilledValidation(credentials.password);
	if (passwordError) { errors.password = passwordError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};

Users.validateUserForgotPassword = function (credentials) {
	var errors = {};

	var emailError = Core.emailValidation(credentials.email);
	if (emailError) { errors.email = emailError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
	}

	return errors;
};

Users.validateUserResetPassword = function (credentials) {
	var errors = {};

	var passwordError = Core.passwordValidation(credentials.password);
	if (passwordError) { errors.password = passwordError; }

	var passwordConfirmationError = Core.matchingValidation(credentials.password, credentials.passwordConfirmation);
	if (passwordConfirmationError) { errors.passwordConfirmation = passwordConfirmationError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
	}

	return errors;
};

Users.validateAddProfile = function (profile) {
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
};

Users.validateUserAddSkill = function (skill, skills) {
	var errors = {};

	var skillError = isFilledValidation(skill);
	if (skillError) { errors.skill = skillError; }

	if (skills && skills.length) {
		var duplicateSkillError = Core.isDuplicateSkillValidation(skill, skills);
		if (duplicateSkillError) { errors.skill = duplicateSkillError; }
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};

Users.validateUserLocation = function (location) {
	console.log('validateUserLocation location: ', location);
	var errors = {};

	var zipcodeError = isFilledValidation(location.zipcode);
	if (zipcodeError) { errors.zipcode = zipcodeError; }

	var countryCodeError = isFilledValidation(location.countryCode);
	if (countryCodeError) { errors.countryCode = countryCodeError; }

	var cityError = isFilledValidation(location.city);
	if (cityError) { errors.city = cityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
	}

	return errors;
};

Users.validateUserIdentity = function (identity) {
	var errors = {};

	var firstnameError = Core.nameValidation(identity.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = Core.nameValidation(identity.lastname);
	if (lastnameError) { errors.lastname = lastnameError; }

	var activityError = isFilledValidation(identity.activity);
	if (activityError) { errors.activity = activityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
	}

	return errors;
};

Users.validateUsersocialProfiles = function (socialProfiles) {
	var errors = {};

	if (socialProfiles.facebook) {
		var facebookCodeError = Core.urlValidation(socialProfiles.facebook);
		if (facebookCodeError) { errors.facebook = facebookCodeError; }
	}

	if (socialProfiles.flickr) {
		var flikrCodeError = Core.urlValidation(socialProfiles.flickr);
		if (flikrCodeError) { errors.flickr = flikrCodeError; }
	}

	if (socialProfiles.twitter) {
		var twitterCodeError = Core.urlValidation(socialProfiles.twitter);
		if (twitterCodeError) { errors.twitter = twitterCodeError; }
	}

	if (socialProfiles.linkedin) {
		var linkedinCodeError = Core.urlValidation(socialProfiles.linkedin);
		if (linkedinCodeError) { errors.linkedin = linkedinCodeError; }
	}

	if (socialProfiles.github) {
		var githubCodeError = Core.urlValidation(socialProfiles.github);
		if (githubCodeError) { errors.github = githubCodeError; }
	}

	if (socialProfiles.tumblr) {
		var tumblrCodeError = Core.urlValidation(socialProfiles.tumblr);
		if (tumblrCodeError) { errors.tumblr = tumblrCodeError; }
	}

	if (socialProfiles.instagram) {
		var instagramCodeError = Core.urlValidation(socialProfiles.instagram);
		if (instagramCodeError) { errors.instagram = instagramCodeError; }
	}

	if (socialProfiles.behance) {
		var behanceCodeError = Core.urlValidation(socialProfiles.behance);
		if (behanceCodeError) { errors.behance = behanceCodeError; }
	}

	if (socialProfiles.pinterest) {
		var pinterestCodeError = Core.urlValidation(socialProfiles.pinterest);
		if (pinterestCodeError) { errors.pinterest = pinterestCodeError; }
	}

	if (socialProfiles.vimeo) {
		var vimeoCodeError = Core.urlValidation(socialProfiles.vimeo);
		if (vimeoCodeError) { errors.vimeo = vimeoCodeError; }
	}

	if (socialProfiles.website) {
		var websiteCodeError = Core.urlValidation(socialProfiles.website);
		if (websiteCodeError) { errors.website = websiteCodeError; }
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};
