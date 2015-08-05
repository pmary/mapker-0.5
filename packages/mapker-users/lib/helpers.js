/*****************************************************************************/
/* Fields validations */
/*****************************************************************************/
Users.validateUserJoin = function (user) {
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
};

Users.validateUserLogin = function (credentials) {
	var errors = {};

	var emailError = emailValidation(credentials.email);
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

	var emailError = emailValidation(credentials.email);
	if (emailError) { errors.email = emailError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

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
		var duplicateSkillError = isDuplicateSkillValidation(skill, skills);
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

	var firstnameError = nameValidation(identity.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = nameValidation(identity.lastname);
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
		var facebookCodeError = urlValidation(socialProfiles.facebook);
		if (facebookCodeError) { errors.facebook = facebookCodeError; }
	}

	if (socialProfiles.flickr) {
		var flikrCodeError = urlValidation(socialProfiles.flickr);
		if (flikrCodeError) { errors.flickr = flikrCodeError; }
	}

	if (socialProfiles.twitter) {
		var twitterCodeError = urlValidation(socialProfiles.twitter);
		if (twitterCodeError) { errors.twitter = twitterCodeError; }
	}

	if (socialProfiles.linkedin) {
		var linkedinCodeError = urlValidation(socialProfiles.linkedin);
		if (linkedinCodeError) { errors.linkedin = linkedinCodeError; }
	}

	if (socialProfiles.github) {
		var githubCodeError = urlValidation(socialProfiles.github);
		if (githubCodeError) { errors.github = githubCodeError; }
	}

	if (socialProfiles.tumblr) {
		var tumblrCodeError = urlValidation(socialProfiles.tumblr);
		if (tumblrCodeError) { errors.tumblr = tumblrCodeError; }
	}

	if (socialProfiles.instagram) {
		var instagramCodeError = urlValidation(socialProfiles.instagram);
		if (instagramCodeError) { errors.instagram = instagramCodeError; }
	}

	if (socialProfiles.behance) {
		var behanceCodeError = urlValidation(socialProfiles.behance);
		if (behanceCodeError) { errors.behance = behanceCodeError; }
	}

	if (socialProfiles.pinterest) {
		var pinterestCodeError = urlValidation(socialProfiles.pinterest);
		if (pinterestCodeError) { errors.pinterest = pinterestCodeError; }
	}

	if (socialProfiles.vimeo) {
		var vimeoCodeError = urlValidation(socialProfiles.vimeo);
		if (vimeoCodeError) { errors.vimeo = vimeoCodeError; }
	}

	if (socialProfiles.website) {
		var websiteCodeError = urlValidation(socialProfiles.website);
		if (websiteCodeError) { errors.website = websiteCodeError; }
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};
