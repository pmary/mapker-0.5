/*****************************************************************************/
/* Fields validations */
/*****************************************************************************/
Users.validateUserJoin = function (user) {
	var errors = {};

	var firstnameError = Core.nameValidation(user.firstname);
	if (firstnameError) { errors.firstname = firstnameError; }

	var lastnameError = Core.nameValidation(user.lastname);
	if (lastnameError) { errors.lastname = lastnameError; }

	var nicHandleError = Core.nicHandleValidation(user.nicHandle);
	if (nicHandleError) { errors.nicHandle = nicHandleError; }

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

	var passwordError = Core.isFilledValidation(credentials.password);
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

	var activityError = Core.isFilledValidation(profile.activity);
	if (activityError) { errors.activity = activityError; }

	var zipcodeError = Core.isFilledValidation(profile.zipcode);
	if (zipcodeError) { errors.zipcode = zipcodeError; }

	var countryCodeError = Core.isFilledValidation(profile.countryCode);
	if (zipcodeError) { errors.countryCode = countryCodeError; }

	var cityError = Core.isFilledValidation(profile.city);
	if (cityError) { errors.city = cityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};

Users.validateUserAddSkill = function (skill, skills) {
	var errors = {};

	var skillError = Core.isFilledValidation(skill);
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

	var zipcodeError = Core.isFilledValidation(location.zipcode);
	if (zipcodeError) { errors.zipcode = zipcodeError; }

	var countryCodeError = Core.isFilledValidation(location.countryCode);
	if (countryCodeError) { errors.countryCode = countryCodeError; }

	var cityError = Core.isFilledValidation(location.city);
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

	var activityError = Core.isFilledValidation(identity.activity);
	if (activityError) { errors.activity = activityError; }

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
	}

	return errors;
};
