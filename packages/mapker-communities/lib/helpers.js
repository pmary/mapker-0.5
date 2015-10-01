Communities.validateCommunityCreate = function (community) {
  var errors = {};

	var nameError = Core.communityNameValidation(community.name);
	if (nameError) { errors.name = nameError; }

  var usernameError = Core.nicHandleValidation(community.username);
	if (usernameError) { errors.username = usernameError; }

  // If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
  }

	return errors;
};
