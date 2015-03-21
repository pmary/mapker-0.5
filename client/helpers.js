// This file is to refactorize and put in the client/helpers folder

/**
 * Slingshot initialization for the client
 */
uploader = new Slingshot.Upload("myFileUploads");

isFilledValidation = function(value) {
	if (value && value.constructor === Array && !value.length) {
		return "Required field";
	} else if (!value) {
		return "Required field";
	} else {
		return false;
	};
}

isFilledTagsinputValidation = function(value) {
	if (value.constructor === Array && !value.length) {
		return "Required field";
	} else if (value.constructor === Array && value.length) {
		return false;
	}
	if (value.objectItems == undefined) {
		return "Required field";
	}
	if (!value) {
		return "Required field";
	}
	return false;
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

numberValidation = function(value) {
	if (!value) {
		return "Required field";
	} else if (value != parseInt(value, 10)) {
		return "Must be a number"
	} else {
		return false;
	}
}