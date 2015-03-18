validateUserJoin = function (user) {
	var errors = {};
	if (!user.firstname) {
		errors.firstname = "Please fill in a firstname";
	} else {
		if (user.firstname.length < 2) {
			errors.firstname = "Ce champ doit contenir au moins 2 caractères";
		} else if (user.firstname.length > 50) {
			errors.firstname = "Ce champ ne doit pas comporter plus de 50 caractères";
		} else if (user.firstname.search(/\d/) != -1) {
			errors.firstname = "Ce champ ne doit pas contenir de chiffre";
		} else if (user.firstname.search(/[a-zA-Z]/) == -1) {
			errors.firstname = "Ce champ doit contenir au moins une lettre";
		} else if (user.firstname.search(/[\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
			errors.firstname = "Caractère invalide dans le nom d'utilisateur";
		}
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

  return errors;
}