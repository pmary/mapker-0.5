/**
 * @summary Generate a random string of the given length
 * @param {Integer} length - The length of the string to generate
 * @return {String} result - The generated string
 */
Core.randomString = function (length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};

/**
 * @summary
 * @see
 */
Core.debounce = function (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

/**
 * @summary Capitalize the first letter of the given string
 * @param {String} value - The string to capitalize
 * @return {String} The capitalized string
 */
Core.capitalize = function (value) {
  check(value, String);
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * @summary Check if an url is valid
 * @param {String} value - The url to check
 * @return {Boolean} - Whether if the url is valid url or not
 */
Core.urlValidation = function(value) {
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

/**
 * @summary Check if the given NIC Handle is valide
 * @param {String} value
 */
Core.nicHandleValidation = function (value) {
  if (value && typeof value === 'string' && /^[A-Za-z0-9_]{1,15}$/.test(value)) {
    return false;
  }
  else {
    return 'Must contain between 1 and 15 alphanumeric characters';
  }
};

/**
 * @summary Check if the given variable is a number
 * @param value - The variable to check
 * @return {Boolean} - Whether if the variable is valid number or not
 */
Core.numberValidation = function(value) {
	if (!value) {
		return 'Required field';
	} else if (value != parseInt(value, 10)) {
		return 'Must be a number';
	} else {
		return false;
	}
};

/**
 * @summary Check if the two given variable are equal
 * @param value1 - One of the variable to compare
 * @param value2 - One of the variable to compare
 * @return {Boolean} - Whether if the variables are equal or not
 */
Core.matchingValidation = function(value1, value2) {
	if (value1 && value2 && value1 !== value2) {
		return 'Password and confirmation doesn\'t match';
	} else {
		return false;
	}
};

/**
 * @summary Check if the given password match the validation criteria
 * @param value - The password to check
 * @return {Boolean} - Whether if the password is valid or not
 */
Core.passwordValidation = function(value) {
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

/**
 * @summary Check if the given phone number match the validation criteria
 * @param value - The phone number to check
 * @return {Boolean} - Whether if the phone number is valid or not
 */
Core.phoneValidation = function(value) {
	var re = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
	if (!re.test(value)) {
		return 'Phone number invalide';
	} else {
		return false;
	}
};

/**
 * @summary Check if the given email match the validation criteria
 * @param value - The email to check
 * @return {Boolean} - Whether if the email is valid or not
 */
Core.emailValidation = function(value) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(value)) {
		return 'Email invalide';
	} else {
		return false;
	}
};

/**
 * @summary Check if the given name match the validation criteria
 * @param value - The name to check
 * @return {Boolean} - Whether if the name is valid or not
 */
Core.nameValidation = function(value) {
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

/**
 * @summary Check if the given input tags match the validation criteria
 * @param value - The input tags to check
 * @return {Boolean} - Whether if the input tags is valid or not
 */
Core.isFilledTagsinputValidation = function(value) {
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

/**
 * @summary Check if the value exist
 * @param value - The input tags to check
 * @return {Boolean} - Whether if the input tags is valid or not
 */
Core.isFilledValidation = function(value) {
	if (value && value.constructor === Array && !value.length) {
		return 'Required field';
	} else if (!value || ! /\S/.test(value)) {
		return 'Required field';
	} else {
		return false;
	}
};

/**
 * @summary Check if the value is an array with at least one value
 * @param value - The array to check
 * @return {Boolean} - Whether if the array is valid or not
 */
Core.isArrayValidation = function(value) {
	if (Array.isArray(value) && value.length) {
		return false;
	}
	else {
		return 'Required field';
	}
};

/**
 * @summary Check if the value is a string
 * @param value - The variable to check
 * @return {Boolean} - Whether if the variable is valid or not
 */
Core.isStringValidation = function(value) {
	if (typeof value == 'string') {
		return false;
	}
	else {
		return 'Required field';
	}
};

/**
 * @summary Check if the user already have the submited skill
 * @locus Anywhere
 * @param {String} value - The string we are looking for
 * @param {Array} array - An array of skill objects
 * @returns {Boolean} False if the user doesn't have the skill
 * @returns {String} An error message if the user already have the skill
 */
Core.isDuplicateSkillValidation = function(value, array) {
	var result = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i].title.toLowerCase() == value.toLowerCase())
			result = 'You already have this skill';
	}
	return result;
};

/**
 * @summary Methods for the image manipulation
 */
Core.imageMethods = {
  /**
   * Receives an Image Object (can be JPG OR PNG) and returns a new Image as compressed DataURL
   * @param {Image} source_img_obj The source Image Object
   * @param {Integer} quality The output quality of Image Object
   * @param {String} output format. Possible values are jpg and png
   * @return {Image} result_image_obj The compressed Image Object
   */

  compress: function(source_img_obj, quality){

    var tempImg = document.createElement('img');
    tempImg.src = source_img_obj;
    var mimType = source_img_obj.split(";")[0].split(":")[1];
    var cvs = document.createElement('canvas');
    cvs.width = tempImg.naturalWidth;
    cvs.height = tempImg.naturalHeight;
    var ctx = cvs.getContext("2d").drawImage(tempImg, 0, 0);
    var newImageData = cvs.toDataURL(mimType, quality/100);
    return newImageData;
  },

  /**
   * Receives a Canvas Object and returns a new Image as compressed DataURL
   * @param {Canvas} canvas The cropped canvas
   * @param {Image} source_img_obj The source Image Object
   * @param {Integer} quality The output quality of Image Object
   * @param {String} output format. Possible values are jpg and png
   * @return {Image} result_image_obj The compressed Image Object
   */
  compressFromCanvas: function(canvas, source_img_obj, quality){
    var mimType = source_img_obj.split(";")[0].split(":")[1];
    var newImageData = canvas.toDataURL(mimType, quality/100);
    return newImageData;
  }
};


/**
 * @summary Perform a file upload to the default S3 bucket via the peerlibrary:aws-sdk package api
 * @param {Object} [resource] The resource document
 * @param {function} [callback] Meteor.wrapAsync callback function that return the uploaded file url
 */
Core.s3Upload = function(params, callback) {
	s3.upload(params, function(err, data) {
		if (err) {
			console.warn("Error uploading data: ", err);
		}
		else {
			callback( null, data.Location );
		}
	});
};

/**
 * @summary Check if the user has sufficient rights over the resource to perform the requested action
 * @param {Object} [resource] The resource document
 * @param {String} [userId] The current user id
 * @return {Boolean}
 */
Core.isUserResourceAdmin = function(resource, userId) {
	// False by default
	var result = false;
	switch(resource.type) {
		case 'user':
			// If the user try to edit his own profile, let him go
			result = true;
			break;

		case 'place':
			// Check if the user id is in the 'administrators' resource array
			result = Meteor.call('canUserEditPlace', resource.id);
			break;
	}
	return result;
};
