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