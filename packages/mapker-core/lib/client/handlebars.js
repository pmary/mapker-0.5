UI.registerHelper('split', function(activities) {
	for (var i = 0; i < activities.length; i++) {
		activities[i] = activities[i].charAt(0).toUpperCase() + activities[i].slice(1);
	}
	return activities.join(", ");
});

UI.registerHelper('splitByScore', function(activities) {
	for (var i = 0; i < activities.length; i++) {
		activities[i] = activities[i].charAt(0).toUpperCase() + activities[i].slice(1);
	}
	return activities.join(" - ");
});

UI.registerHelper('splitByScoreAndLimit', function(activities, maxLength) {
	for (var i = 0; i < activities.length; i++) {
		activities[i] = activities[i].charAt(0).toUpperCase() + activities[i].slice(1);
	}
	activities = activities.join(" - ");

	// Limit the lenght of the string
	if (activities.length > maxLength) {
		activities = activities.substr(0,maxLength-1)+'...';
	}
	return activities;
});

// Helper to user test equality
UI.registerHelper('eq', function(v1, v2, options) {
	var result;
	if (v1 !== null) {
		if (v2 instanceof Array) {
			for (var i = 0; i < v2.length; i++) {
				if(v1.indexOf(v2[i]) > -1){ result = true; }
				else { result = false; }
			}
		}
		else {
			if(v1 == v2){ result = true; }
			else { result = false; }
		}
	}

	return result;
});

// Check if a value exist in the given array
UI.registerHelper('inArray', function(value, array) {
	if (value && array && array.constructor === Array) {
		if (array.indexOf(value) > -1) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
});

/**
 * @summary Check if the given user id is in the giver array of object
 */
UI.registerHelper('isValueInArrayOfObjects', function (index, value, arrayOfObjects) {
	if (! index || ! value || ! arrayOfObjects) return false;

  var found = arrayOfObjects.some(function (el) {
    return el[index] === value;
  });
  if (!found) return false;
	else return true;
});

/**
 * @summary Check if the given array is empty
 */
UI.registerHelper('isArrayEmpty', function (array) {
	if (! array || ! array.length) {
		return false
	}
	else if (array.length) {
		return true
	}
	else {
		return false;
	}
});

// Check if the user have fill at least one social profile link
UI.registerHelper('hasSocialLink', function(links) {
	var result = false;

	if (links) {
		if (links.facebook || links.flickr || links.twitter || links.website) {
			result = true;
		}
	}

	return result;
});

// replace \n and \r bu a <br> tag
UI.registerHelper('htmlLineBreack', function(text) {
	if (text !== null){
		text = text.replace(/\r?\n/g, '<br>');
	}
	return text;
});
