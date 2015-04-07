/**
 * Set a default data set for developement purpose
 */
if (Meteor.users.find().count() === 0) {
	// Insert some fake user data
	Meteor.users.insert({
		"_id": "i4FxWHYGyQr3LyN4x",
		"emails": [
			{
				"address": "contact@pierre-mary.fr",
				"verified": false
			}
		],
		"profile": {
			"firstname": "Pierre",
			"lastname": "Mary",
			"activity": "Développeur",
			"countryCode": "FR",
			"zipcode": "75002",
			"skills": []
		},
		"createdAt": "2015-04-07T13:55:07.055Z",
		"services": {
			"password": {
				"bcrypt": "$2a$10$v2TlzgpnE1P0suDat36Ib.2XDusfIHkepa.HIAySCO8DpF1bIigbi"
			},
			"resume": {
				"loginTokens": [
					{
						"when": "2015-04-07T13:55:07.061Z",
						"hashedToken": "2JjDKJqaBqEU8vHq59tIVlBNbMkb/+51OVa1z32u1ms="
					}
				]
			}
		}
	});
};

if (Labs.find().count() === 0) {
	// Insert some fake lab data
};

if (Machines.find().count() === 0) {
	// Insert some fake machine data
};

if (Places.find().count() === 0) {
	// Insert some fake place data
	Places.insert({
		_id: "j7gq8Pc9ZDS8EuG89",
	    administrators: [
	        "s6bx9toeqhDoSbzyd", 
	        "nb6iTbrTKNH4KtePh"
	    ],
	    activities: "Fablab",
	    activated: true,
	    machines: [],
	    city: "Rennes",
	    country: "FR",
	    county: "Rennes",
	    loc: [48.868499, 2.352093],
	    postalCode: 35000,
	    state: "Brittany",
	    street: "34 Rue Hoche",
	    submittedBy: "s6bx9toeqhDoSbzyd",
	    submittedOn: Date("2014-10-03T23:50:22.959Z"),
	    title: "Labfab",
	    avatar: "ojEzCbmh4cfykyiaH"
	});
};

if (Projects.find().count() === 0) {
	// Insert some fake project data
};