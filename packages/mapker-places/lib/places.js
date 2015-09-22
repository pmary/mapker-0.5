/**
 * Front validators
 */
Places.validateLocation = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var typesError = Core.isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var specialitiesError = Core.isArrayValidation(place.specialities);
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

	var typesError = Core.isArrayValidation(place.types);
	if (typesError) {
		errors.types = typesError;
	}

	var specialitiesError = Core.isArrayValidation(place.specialities);
	if (specialitiesError) {
		errors.specialities = specialitiesError;
	}

	if (place.website) {
		var websiteError = Core.urlValidation(place.website);
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

	var moError = Core.isStringValidation(openingHours.mo);
	if (moError) {
		errors.mo = moError;
	}

	var tuError = Core.isStringValidation(openingHours.tu);
	if (tuError) {
		errors.tu = tuError;
	}

	var weError = Core.isStringValidation(openingHours.we);
	if (weError) {
		errors.we = weError;
	}

	var thError = Core.isStringValidation(openingHours.th);
	if (thError) {
		errors.th = thError;
	}

	var frError = Core.isStringValidation(openingHours.fr);
	if (frError) {
		errors.fr = frError;
	}

	var saError = Core.isStringValidation(openingHours.sa);
	if (saError) {
		errors.sa = saError;
	}

	var suError = Core.isStringValidation(openingHours.su);
	if (suError) {
		errors.su = suError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};
