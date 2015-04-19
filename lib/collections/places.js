Places = new Meteor.Collection('places');

// Init the search
/*Places.initEasySearch(['name', 'themes', 'activities'], {
	'limit' : 20,
	'use' : 'mongo-db'
});*/

// Defines the search methods
EasySearch.createSearchIndex('places', {
	'field' : ['name', 'activities'],
	'collection' : Places,
	'limit' : 20,
	'use' : 'mongo-db',
	'props' : {
		//'onlyShowActivated' : true // demo purpose configuration, can be used in query  
	},
	'query' : function (searchString, opts) {
		var searchObject = JSON.parse(searchString);
		// Default query that is used for searching
		//var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchObject.text);
		/*{ $and: [ {administrators: userId}, {_id: resource.id} ] }
		{ "loc": {$within: {$box: bbox}} }*/
		var query = { $and: [{ '$text': {'$search': searchObject.text}}, { "loc": {$within: {$box: JSON.parse(searchObject.bbox)}} }] };

		// Limit the query to a geographical perimeters by a bounding box
		//query.$and.push({ "loc": {$within: {$box: bbox}} });

		// this contains all the configuration specified above
		if (this.props.onlyShowActivated) {
			query.activated = true;
		}

		if (searchObject.bbox) {
			//query.$and.loc({$within: {$box: searchObject.bbox}}); 
		};

		return query;
	}
});

/**
 * Front validators 
 */
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


/**
 * Methods 
 */
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
			//cover: "",
			//description: "",
			//logo: "",
			//machines: [],
			submittedBy: user._id,
			submittedAt: new Date()
		});
		// Inster the post
		var placeId = Places.insert(place);

		// Notify the admin that he have a new place to validate by email
		if (Meteor.isServer) {
			Email.send({
				to: "contact@pierre-mary.fr",
				from: "noreply@mapker.co",
				subject: "New place waiting for validation",
				html: "Hello dear moderator, <br>A place named " + place.name + " is waiting for your validation on <a href='http://mapker.co'>Mapker</a>.",
				text: "Hello dear moderator, \n\nA place named " + place.name + " is waiting for your validation on Mapker (http://mapker.co)."
		    });
	    }

		return {
			_id: placeId
		};
	},
	adminPlaceEdit: function(placeAttributes) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(placeAttributes, Object);
		check(placeAttributes.place, {
			_id: String,
			administrators: Array,
			name: String
		});
		
		if (placeAttributes.activated) {
			check(placeAttributes.activated, Boolean);
		};

		var place = _.extend(placeAttributes.place);
		if (placeAttributes.activated) {
			console.log("the place will be activated");
			var placeId = Places.update({_id: place._id}, { $set: {activated: placeAttributes.activated, name: place.name} });
		}else {
			var placeId = Places.update({_id: place._id}, { $set: {name: place.name} });
		};

		// Notify the user that his place has been validated
		if (Meteor.isServer) {
			if (!placeAttributes.activated)
				return;

			var admins = Meteor.users.find({_id: { $in: place.administrators } }, {item: 1, emails: 1}).fetch();
			//check(Meteor.userId(), String);
			for (var i = 0; i < admins.length; i++) {
				if (admins[i].emails[0].address) {
					console.log(admins[i].emails[0].address);
					Email.send({
						to: admins[i].emails[0].address,
						from: "noreply@mapker.co",
						subject: "Your place has been validated",
						html: "Thank you for your submission, <br>" + place.name + " has been validated. You can now edit it at <a href='http://mapker.co/places/" + place._id + "'>http://mapker.co/places/" + place._id + "</a>.",
						text: "Thank you for your submission, \n\n" + place.name + " has been validated. You can now edit it at http://mapker.co/places/" + place._id + "."
				    });
				    console.log("Email send to: " + admins[i].profile.firstname);
				};
			};
			
	    }
	},
	placeIdentityUpdate: function(place) {
		check(Meteor.userId(), String); // Check if the user is loged in
		check(place, {
			id: String,
			name: String,
			activities: Array,
			streetNumber: String,
			streetName: String,
			city: String,
			zipcode: String,
			countryCode: String,
			formattedAddress: String,
			loc: Array
		});
		Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: place.id} ] }, { $set: {
			name: place.name,
			activities: place.activities,
			streetNumber: place.streetNumber,
			streetName: place.streetName,
			city: place.city,
			zipcode: place.zipcode,
			countryCode: place.countryCode,
			formattedAddress: place.formattedAddress,
			loc: place.loc
		} });
	},
	placeUpdateSocialProfiles: function(placeSocialProfiles) {
		check(Meteor.userId(), String);
		check(placeSocialProfiles, {
			id: String,
			facebook: String,
			flickr: String,
			twitter: String,
			website: String
		});
		var user = Meteor.user();
		Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: placeSocialProfiles.id} ] }, { $set: {
			'links.facebook': placeSocialProfiles.facebook,
			'links.flickr': placeSocialProfiles.flickr,
			'links.twitter': placeSocialProfiles.twitter,
			'links.website': placeSocialProfiles.website
		} });
	},
	placeUpdateAbout: function(place) {
		// Data check
		check(Meteor.userId(), String);  // Check if the user is loged in
		check(place, {
			id: String,
			about: String
		});
		var placeId = Places.update({ $and: [ {administrators: Meteor.userId()}, {_id: place.id} ] }, { $set: {
			'about': place.about
		} });
		return {
			_id: placeId
		};
	}
});