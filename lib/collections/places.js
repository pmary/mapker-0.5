Places = new Meteor.Collection('places');

validateLocation = function (place) {
	var errors = {};

	var nameError = isFilledValidation(place.name);
	if (nameError) {
		errors.name = nameError;
	}

	var themesError = isFilledTagsinputValidation(place.themes);
	if (themesError) {
		errors.themes = themesError;
	}

	var activitiesError = isFilledTagsinputValidation(place.activities);
	if (activitiesError) {
		errors.activities = activitiesError;
	}

	var roleError = isFilledValidation(place.role);
	if (roleError) {
		errors.role = roleError;
	}

	var addressError = isFilledValidation(place.address);
	if (addressError) {
		errors.address = addressError;
	}

	// If there is no error, reset the object to clear the eventual previous errors
	if (!Object.keys(errors).length)
		errors = {};

	//console.log(place);

	return errors;
}

Meteor.methods({
	placeInsert: function(placeAttributes) {
		// Data check
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, {
			activities: Array,
			city: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array,
			name: String,
			role: String,
			streetName: String,
			streetNumber: String,
			themes: Array,
			zipcode: String
		});
		// Set complementary data
		var user = Meteor.user();
		var administrators = Meteor.user();
		var place = _.extend(placeAttributes, {
			administrators: [user._id], 
			activated: false, 
			cover: "",
			description: "",
			logo: "",
			machines: [],
			submittedBy: user._id,
			submittedAt: new Date()
		});
		// Inster the post
		var placeId = Places.insert(place);
		return {
			_id: placeId
		};
	}
});