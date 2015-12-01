/**
 * @description
 * Format a date to a specific format using moment.js
 *
 * @param {String} date - ISO date, like 2015-08-31T12:12:32.710Z
 * @param {String} format - Date format, like "MM-DD-YYYY hh:mm:ss"
 * @see http://momentjs.com/docs/
 */
UI.registerHelper('formatDate', function (date, format) {
	if (date && format) {
		var momentDate = moment(new Date(date));
		return moment(momentDate).format(format);
	}
});

/**
 * @description
 * Get the time between a given date and now
 *
 * @param {String} date - ISO date, like 2015-08-31T12:12:32.710Zs"
 * @return {String} Like "18 days ago"
 * @see http://momentjs.com/docs/#/displaying/fromnow/
 */
UI.registerHelper('fromNow', function (date) {
	if (date) {
		var momentDate = moment(new Date(date));
		return moment(momentDate).fromNow();
	}
});

UI.registerHelper('split', function(activities) {
	if (activities && activities.length) {
		for (var i = 0; i < activities.length; i++) {
			activities[i] = activities[i].charAt(0).toUpperCase() + activities[i].slice(1);
		}
		return activities.join(", ");
	}
	else {
		return;
	}
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

/**
 * @description
 * Helper to user test equality
 */
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
			if(v1 === v2){ result = true; }
			else { result = false; }
		}
	}

	return result;
});

/**
 * @description Check if a value exist in the given array
 */
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
 * @description
 * Check if the given user id is in the giver array of object
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
 * @description
 * Check if the given array is empty
 */
UI.registerHelper('isArrayEmpty', function (array) {
	console.log('isArrayEmpty array', array);
	//console.log(Object.prototype.toString.call( array ));

	if (! array) {
		return true;
	}

	var proto = Object.prototype.toString.call( array );

	if (proto === '[object Array]') {
		if (array.length) {
			return false;
		}
	}
	else if (proto === '[object Object]') {
		return false;
	}

	// By default, return false
	return true;
});

/**
 * @description
 * Check if the user have fill at least one social profile link
 */
UI.registerHelper('hasSocialLink', function(links) {
	var result = false;

	if (links) {
		if (links.facebook || links.flickr || links.twitter || links.website) {
			result = true;
		}
	}

	return result;
});

/**
 * @description
 * Replace \n and \r bu a <br> tag
 */
UI.registerHelper('htmlLineBreack', function(text) {
	if (text !== null){
		text = text.replace(/\r?\n/g, '<br>');
	}
	return text;
});


/**
 * @description
 * Return a taxon from a taxons array by it's id
 * @see http://api.jquery.com/jQuery.grep/
 */
UI.registerHelper('getTaxonById', function(taxons, id) {
	check(taxons, Array);
	check(id, String);

	for (let i = 0; i < taxons.length; i++) {
		if (taxons[i]._id === id) {
			return taxons[i].name;
		}
	}
});
