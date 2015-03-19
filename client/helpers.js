// This file is to refactorize and put in the client/helpers folder

/**
 * Slingshot initialization for the client
 */
uploader = new Slingshot.Upload("myFileUploads");

isFilledValidation = function(value) {
	if (!value) {
		return "Required field";
	}else {
		return false;
	};
}

nameValidation = function(value) {
	if (!value) {
		return "Required field";
	} else if (value.length < 2) {
		return "Ce champ doit contenir au moins 2 caractères";
	} else if (value.length > 50) {
		return "Ce champ ne doit pas comporter plus de 50 caractères";
	} else if (value.search(/\d/) != -1) {
		return "Ce champ ne doit pas contenir de chiffre";
	} else if (value.search(/[a-zA-Z]/) == -1) {
		return "Ce champ doit contenir au moins une lettre";
	} else if (value.search(/[\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
		return "Caractère invalide dans le nom d'utilisateur";
	}else {
		return false;
	}
}

emailValidation = function(value) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(value)) {
		return "Email invalide"
	} else {
		return false;
	}
}

passwordValidation = function(value) {
	if (!value) {
		return "Required field";
	} else if (value.length < 6) {
		return "Votre mot de passe doit contenir au moins 6 caractères";
	} else if (value.length > 50) {
		return "Votre mot de passe ne doit pas comporter plus de 50 caractères";
	} else if (value.search(/\d/) == -1) {
		return "Votre mot de passe doit contenir au moins un chiffre";
	} else if (value.search(/[a-zA-Z]/) == -1) {
		return "Votre mot de passe doit contenir au moins une lettre";
	/*} else if (fields[i].node.value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
		isValidePassword = false;
		passErrorMsg = "bad_char";*/
	} else {
		return false;
	}
}

matchingValidation = function(value1, value2) {
	if (value1 && value2 && value1 != value2) {
		return "Password and confirmation doesn't match";
	} else {
		return false;
	};
}

/**
 * Valadation of form fields
 * @param: fields -> A JSON object containing the fields description like [{node: email, type: "email",required: true, message: "Required Field"}, {...}, ...]
 * @return: true/false
 */
fieldsValidation = function(fields) {
	var status = true;
	for (var i = fields.length - 1; i >= 0; i--) {
		// Reinitialize all the fields error
		fields[i].node.className = fields[i].node.className.replace(" error", "");
		fields[i].node.parentNode.className = fields[i].node.parentNode.className.replace(" error", "");
		fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "none";

		// Password validation
		if (fields[i].type == "password" || fields[i].type == "password-confirmation") {
			var passErrorMsg = "";
			var isValidePassword = true;

			// If it's a confirmation field
			if (fields[i].mustBeEqualTo) {
				if (fields[i].node.value != fields[i].mustBeEqualTo.value) {
					fields[i].node.className = fields[i].node.className + " error";
					fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
					fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
					fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = "Password and confirmation doesn't match";
				};
			}
			// else if it's a standard password field
			else {
				if (fields[i].node.value.length < 6) {
					isValidePassword = false;
					passErrorMsg = "Votre mot de passe doit contenir au moins 6 caractères";
				} else if (fields[i].node.value.length > 50) {
					isValidePassword = false;
					passErrorMsg = "Votre mot de passe ne doit pas comporter plus de 50 caractères";
				} else if (fields[i].node.value.search(/\d/) == -1) {
					isValidePassword = false;
					passErrorMsg = "Votre mot de passe doit contenir au moins un chiffre";
				} else if (fields[i].node.value.search(/[a-zA-Z]/) == -1) {
					isValidePassword = false;
					passErrorMsg = "Votre mot de passe doit contenir au moins une lettre";
				/*} else if (fields[i].node.value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
					isValidePassword = false;
					passErrorMsg = "bad_char";*/
				}

				if (!isValidePassword) {
					status = false;
					fields[i].node.className = fields[i].node.className + " error";
					fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
					fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
					fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = passErrorMsg;
				};
			};
		};

		// First name and last name validation
		if (fields[i].type == "text") {
			var isValideName = true;
			var nameErrorMsg;

			if (fields[i].node.value.length < 2) {
				isValideName = false;
				nameErrorMsg = "Ce champ doit contenir au moins 2 caractères";
			} else if (fields[i].node.value.length > 50) {
				isValideName = false;
				nameErrorMsg = "Ce champ ne doit pas comporter plus de 50 caractères";
			} else if (fields[i].node.value.search(/\d/) != -1) {
				isValideName = false;
				nameErrorMsg = "Ce champ ne doit pas contenir de chiffre";
			} else if (fields[i].node.value.search(/[a-zA-Z]/) == -1) {
				isValideName = false;
				nameErrorMsg = "Ce champ doit contenir au moins une lettre";
			} else if (fields[i].node.value.search(/[\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
				isValideName = false;
				nameErrorMsg = "Caractère invalide dans le nom d'utilisateur";
			}

			if (!isValideName) {
				status = false;
				fields[i].node.className = fields[i].node.className + " error";
				fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
				fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
				fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = nameErrorMsg;
			};
		};

		// First name and last name validation
		if (fields[i].type == "email") {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(fields[i].node.value)) {
				status = false;
				fields[i].node.className = fields[i].node.className + " error";
				fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
				fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
				fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = "Email invalide"
			}
		};

		// If the field is required but the node is empty
		if (fields[i].required && !fields[i].node.value) {
			status = false;

			fields[i].node.className = fields[i].node.className + " error";
			fields[i].node.parentNode.className = fields[i].node.parentNode.className + " error";
			fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].style.display = "block";
			fields[i].node.parentNode.parentNode.getElementsByTagName("small")[0].innerHTML = fields[i].message;
		};
	};

	return status;
}