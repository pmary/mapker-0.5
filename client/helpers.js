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
			result = 'You already have this skill';
	}
	return result;
};

isStringValidation = function(value) {
	if (typeof value == 'string') {
		return false;
	}
	else {
		return 'Required field';
	}
};

isArrayValidation = function(value) {
	if (Array.isArray(value) && value.length) {
		return false;
	}
	else {
		return 'Required field';
	}
};

isFilledValidation = function(value) {
	if (value && value.constructor === Array && !value.length) {
		return 'Required field';
	} else if (!value || ! /\S/.test(value)) {
		return 'Required field';
	} else {
		return false;
	}
};

isFilledTagsinputValidation = function(value) {
	if (value.constructor === Array && !value.length) {
		return 'Required field';
	} else if (value.constructor === Array && value.length) {
		return false;
	}
	if (value.objectItems === undefined) {
		return 'Required field';
	}
	if (!value) {
		return 'Required field';
	}
	return false;
};

nameValidation = function(value) {
	if (!value) {
		return 'Required field';
	} else if (value.length < 2) {
		return 'This field must contain at least 2 characters';
	} else if (value.length > 50) {
		return 'This field must not contain more than 50 characters';
	} else if (value.search(/\d/) != -1) {
		return 'This field should not contain digit';
	} else if (value.search(/[a-zA-Z]/) == -1) {
		return 'This field must contain at least one letter';
	} else if (value.search(/[\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
		return 'Invalid character in the user name';
	}else {
		return false;
	}
};

emailValidation = function(value) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(value)) {
		return 'Email invalide';
	} else {
		return false;
	}
};

phoneValidation = function(value) {
	var re = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
	if (!re.test(value)) {
		return 'Phone number invalide';
	} else {
		return false;
	}
};

passwordValidation = function(value) {
	if (!value) {
		return 'Required field';
	} else if (value.length < 6) {
		return 'This field must contain at least 6 characters';
	} else if (value.length > 50) {
		return 'This field must not contain more than 50 characters';
	} else if (value.search(/\d/) == -1) {
		return 'Your password must contain at least one digit';
	} else if (value.search(/[a-zA-Z]/) == -1) {
		return 'Your password must contain at least one letter';
	/*} else if (fields[i].node.value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
		isValidePassword = false;
		passErrorMsg = "bad_char";*/
	} else {
		return false;
	}
};

matchingValidation = function(value1, value2) {
	if (value1 && value2 && value1 != value2) {
		return 'Password and confirmation doesn\'t match';
	} else {
		return false;
	}
};

numberValidation = function(value) {
	if (!value) {
		return 'Required field';
	} else if (value != parseInt(value, 10)) {
		return 'Must be a number';
	} else {
		return false;
	}
};

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
};
