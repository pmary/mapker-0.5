/** 
 * @todo refactorize and put in the client/helpers folder
 */

UI.registerHelper('split', function(activities) {
	return activities.join(", ");
});

// Helper to user test equality
UI.registerHelper('eq', function(v1, v2, options) {
	var result;
	if (v1 != null) {
		if (v2 instanceof Array) {
			for (var i = 0; i < v2.length; i++) {
				if(v1.indexOf(v2[i]) > -1){ result = true; }
				else { result = false; }
			};
		}
		else {
			if(v1 == v2){ result = true; } 
			else { result = false; }
		};
	};

	return result;
});

UI.registerHelper('inArray', function(value, array) {
	if (value && array && array.constructor === Array) {
		if (array.indexOf(value) > -1) {
		return true
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}	
});

// replace \n and \r bu a <br> tag
UI.registerHelper('htmlLineBreack', function(text) {
	if (text!=null){
		text = text.replace(/\r?\n/g, '<br>');
	}
	return text;
});

/**
 * @summary Check if the user already have the submited skill
 * @locus Anywhere
 * @params {String} value - The string we are looking for
 * @params {Array} array - An array of skill objects
 * @returns {Boolean} False if the user doesn't have the skill
 * @returns {String} An error message if the user already have the skill
 */
isDuplicateSkillValidation = function(value, array) {
	var result = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i].title.toLowerCase() == value.toLowerCase())
			result = "You already have this skill";
	}
	return result;
}

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

phoneValidation = function(value) {
	var re = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
	if (!re.test(value)) {
		return "Phone number invalide"
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

urlValidation = function(value) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	if(!pattern.test(value)) {
		return "Must be a valid url";
	} else {
		return false;
	}
}