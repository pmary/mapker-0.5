/**
 * Front validators
 */
Places.validateLocation = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var typesError = isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var specialitiesError = isArrayValidation(place.specialities);
	if (specialitiesError) {
		errors.specialities = specialitiesError;
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

Places.validatePlaceSuggestion = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var typesError = isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var specialitiesError = isArrayValidation(place.specialities);
	if (specialitiesError) {
		errors.specialities = specialitiesError;
	}

	if (place.website) {
		var websiteError = urlValidation(place.website);
		if (websiteError) {
			errors.website = websiteError;
		}
	}

	var contactError = isFilledValidation(place.contact);
	if (contactError) {
		errors.contact = contactError;
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

Places.validateOpeningHours = function (openingHours) {
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
