/**
 * @summary Validate the machine add form value
 * @param {Object} machine - The machine attributes values
 * @return {Object} errors - Contain all the errors raised
 */
Machines.addFormValidation = function (machine) {
  var errors = {};

  var nameError = Core.isFilledValidation(machine.name);
	if (nameError) {
		errors.name = nameError;
	}

  var typeError = Core.isFilledValidation(machine.type);
	if (typeError) {
		errors.type = typeError;
	}

  var brandError = Core.isFilledValidation(machine.brand);
	if (brandError) {
		errors.brand = brandError;
	}

  var workshopError = Core.isFilledValidation(machine.workshop);
	if (workshopError) {
		errors.workshop = workshopError;
	}

  var widthError = Core.isFilledValidation(machine.width);
	if (widthError) {
		errors.width = widthError;
	}

  var lengthError = Core.isFilledValidation(machine.length);
	if (lengthError) {
		errors.length = lengthError;
	}

  var heightError = Core.isFilledValidation(machine.height);
	if (heightError) {
		errors.height = heightError;
	}

  // If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	return errors;
};
