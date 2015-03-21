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

validateUserResetPassword = function (credentials) {
	var errors = {};

	var passwordError = passwordValidation(credentials.password);
	if (passwordError) {
		errors.password = passwordError;
	}

	var passwordConfirmationError = matchingValidation(credentials.password, credentials.passwordConfirmation);
	if (passwordConfirmationError) {
		errors.passwordConfirmation = passwordConfirmationError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
}