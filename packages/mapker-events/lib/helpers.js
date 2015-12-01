Events.validateEventCreate = function (event) {
  var errors = {};

	var nameError = Core.eventNameValidation(event.name);
	if (nameError) { errors.name = nameError; }

  var formattedAddressError = Core.isFilledValidation(event.formattedAddress);
	if (formattedAddressError) {
		errors.address = formattedAddressError;
	}

  var startDateError = Core.isValidDate(event.startDate);
  var endDateError = Core.isValidDate(event.endDate);
  if (startDateError || endDateError) { errors.date = startDateError; }

  var aboutError = Core.isFilledValidation(event.aboutText);
	if (aboutError) { errors.about = aboutError; }

  var contributorsError = Core.isArrayValidation(event.contributors);
	if (contributorsError) { errors.contributors = contributorsError; }

  if (event.reservation) {
    var reservationError = Core.urlValidation(event.reservation);
  	if (reservationError) { errors.reservation = reservationError; }
  }

  var typeError = Core.isFilledValidation(event.type);
	if (typeError) { errors.type = typeError; }

  var topicError = Core.isFilledValidation(event.topic);
	if (topicError) { errors.topic = topicError; }

  // If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length) {
		errors = {};
  }

	return errors;
};
