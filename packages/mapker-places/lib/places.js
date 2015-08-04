/**
 * Front validators
 */
validateLocation = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var typesError = isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var phoneError = phoneValidation(place.phone);
	if (phoneError) {
		errors.phone = phoneError;
	}

	var specialitiesError = isArrayValidation(place.specialities);
	if (specialitiesError) {
		errors.specialities = specialitiesError;
	}

	var roleError = isFilledValidation(place.role);
	if (roleError) {
		errors.role = roleError;
	}

	var addressError = isFilledValidation(place.address);
	if (addressError) {
		errors.address = addressError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};

validateOpeningHours = function (openingHours) {
	var errors = {};

	var moError = isStringValidation(openingHours.mo);
	if (moError) {
		errors.mo = moError;
	}

	var tuError = isStringValidation(openingHours.tu);
	if (tuError) {
		errors.tu = tuError;
	}

	var weError = isStringValidation(openingHours.we);
	if (weError) {
		errors.we = weError;
	}

	var thError = isStringValidation(openingHours.th);
	if (thError) {
		errors.th = thError;
	}

	var frError = isStringValidation(openingHours.fr);
	if (frError) {
		errors.fr = frError;
	}

	var saError = isStringValidation(openingHours.sa);
	if (saError) {
		errors.sa = saError;
	}

	var suError = isStringValidation(openingHours.su);
	if (suError) {
		errors.su = suError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};
