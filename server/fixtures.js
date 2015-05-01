/**
 * Set a default data set for developement purpose
 */
 Meteor.startup(function () {
	if (Meteor.users.find().count() > 0) {
		//Meteor.users.remove({});
	}

	if (Places.find().count() > 0) {
		//Places.remove({});
	};

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
				"fullname": "Pierre Mary",
				"firstname": "Pierre",
				"lastname": "Mary",
				"activity": "Développeur",
				"bio" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
				"skills": [
					{
			            "title" : "Développement web"
			        }, 
			        {
			            "title" : "UX design"
			        }
			    ],
			    "address" : {
		            "countryCode" : "FR",
		            "zipcode" : "75008",
		            "city" : "Paris",
		            "loc" : [ 
		                48.8718722, 
		                2.31764320000002
		            ]
		        },
		        "avatar" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/avatar",
		            "name" : "i4FxWHYGyQr3LyN4x/avatar"
		        },
		        "cover" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/cover",
		            "name" : "i4FxWHYGyQr3LyN4x/cover",
		            "focusX" : 0,
		            "focusY" : 0,
		            "w" : 1500,
		            "h" : 844
		        }
			},
			"createdAt": "2015-04-07T13:55:07.055Z",
			"services": {
				"password": {
					"bcrypt": "$2a$10$R5KsPj8VPSAe9ak8boIa2ulgz9XAxourReWKsc0D/zDPWBt9hIV/K"
				},
				"resume": {
					"loginTokens": [
						{
							"when": "2015-04-07T13:55:07.061Z",
							"hashedToken": "UKyLUckPyjNcXHDL/CMw6rtNBv9NE58LUEtjr/Lh4Pl="
						}
					]
				}
			}
		});
		Meteor.users.insert({
		    "_id" : "cAqconthf92Yrnutf",
		    "createdAt" : Date("2015-04-20T19:33:59.028Z"),
		    "services" : {
		        "password" : {
		            "bcrypt" : "$2a$10$R5KsPj8VPSAe9ak8boIa2ulgz9XAxourReWKsc0D/zDPWBt9hIV/K"
		        },
		        "resume" : {
		            "loginTokens" : [ 
		                {
		                    "when" : Date("2015-04-20T19:33:59.029Z"),
		                    "hashedToken" : "UKyLUckPyjNcXHDL/CMw6rtNBv9NE58LUEtjr/Lh4Pk="
		                }
		            ]
		        }
		    },
		    "emails" : [ 
		        {
		            "address" : "axel.delbrayere@gmail.com",
		            "verified" : false
		        }
		    ],
		    "profile" : {
		        "fullname" : "Axel Delbrayère",
		        "firstname" : "Axel",
		        "lastname" : "Delbrayère",
		        "activity" : "Designer",
		        "bio" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
		        "skills" : [ 
		            {
		                "title" : "Découper des trucs"
		            }, 
		            {
		                "title" : "Design d'objet industriel"
		            }
		        ],
		        "address" : {
		            "countryCode" : "FR",
		            "zipcode" : "75007",
		            "city" : "Paris",
		            "loc" : [ 
		                48.8718722, 
		                2.31764320000002
		            ]
		        },
		        "avatar" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/cAqconthf92Yrnutf/avatar",
		            "name" : "cAqconthf92Yrnutf/avatar"
		        },
		        "cover" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/cAqconthf92Yrnutf/cover",
		            "name" : "cAqconthf92Yrnutf/cover",
		            "focusX" : -0.03554502369668244,
		            "focusY" : -0.2050473186119874,
		            "w" : 3264,
		            "h" : 2448
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
		    "_id" : "ZMLHc88hxncfC6bkj",
		    "name" : "L'Usine IO",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "prototypage", 
		        "incubation"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8884512, 
		        2.312168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 200,
		        "h" : 200
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/cover",
		        "name" : "ZMLHc88hxncfC6bkj/cover",
		        "focusX" : 0.01895734597156396,
		        "focusY" : -0.302491103202847,
		        "w" : 850,
		        "h" : 567
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bka",
		    "name" : "Le fabshop",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "prototypage"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8184512, 
		        2.332168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkb",
		    "name" : "ICI Montreuil",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "aerospatial"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8484512, 
		        2.392168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkb/avatar",
		        "name" : "ZMLHc88hxncfC6bkb/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 94,
		        "h" : 200
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkb/cover",
		        "name" : "ZMLHc88hxncfC6bkb/cover",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 1024,
		        "h" : 300
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkc",
		    "name" : "L'Electrolab",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "Electronique", 
		        "automatisation"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8384512, 
		        2.282168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkc/avatar",
		        "name" : "ZMLHc88hxncfC6bkc/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 205,
		        "h" : 205
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkc/cover",
		        "name" : "ZMLHc88hxncfC6bkc/cover",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 1920,
		        "h" : 1025
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkd",
		    "name" : "AutoLab",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "carosserie", 
		        "réparation", 
		        "mécanique"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8584512, 
		        2.322168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkd/avatar",
		        "name" : "ZMLHc88hxncfC6bkd/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 186,
		        "h" : 204
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkd/cover",
		        "name" : "ZMLHc88hxncfC6bkd/cover",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 1200,
		        "h" : 600
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bke",
		    "name" : "Lorem ipsum",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "aerospatial"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8324512, 
		        2.341168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkf",
		    "name" : "Sit amet",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "aerospatial"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8434512, 
		        2.322168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkg",
		    "name" : "FakeLab",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "prototypage"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8584512, 
		        2.343168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkg/avatar",
		        "name" : "ZMLHc88hxncfC6bkg/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 1275,
		        "h" : 1269
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkg/cover",
		        "name" : "ZMLHc88hxncfC6bkg/cover",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 900,
		        "h" : 601
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkh",
		    "name" : "Le bricro-garage",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "automobile", 
		        "mécanique"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8534512, 
		        2.372168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bki",
		    "name" : "L'ornithoptère",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "fusée", 
		        "hélicoptère", 
		        "ornithologie"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8784512, 
		        2.331168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkz",
		    "name" : "La Paillasse",
		    "themes" : [ 
		        "biologie", 
		        "aerospatial", 
		        "océan"
		    ],
		    "activities" : [ 
		        "co-working", 
		        "aerospatial"
		    ],
		    "role" : "Administrateur",
		    "streetNumber" : "226",
		    "streetName" : "Rue saint denis",
		    "zipcode" : "75002",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8684512, 
		        2.352168
		    ],
		    "formattedAddress" : "226 Rue Saint-Denis, 75002 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf", 
		        "i4FxWHYGyQr3LyN4x"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-20T19:48:34.680Z"),
		    "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. \n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? \n\nQuis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		    "links" : {
		        "facebook" : "https://www.facebook.com/groups/206707586012941/",
		        "flickr" : "",
		        "twitter" : "",
		        "website" : ""
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkz/avatar",
		        "name" : "ZMLHc88hxncfC6bkz/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkk/cover",
		        "name" : "ZMLHc88hxncfC6bkk/cover",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 2298,
		        "h" : 1723
		    }
		});
		Places.insert({
		    "_id" : "sEJKLQfXWmffogyt4",
		    "name" : "aaa",
		    "themes" : [ 
		        "aaa"
		    ],
		    "activities" : [ 
		        "aaa"
		    ],
		    "role" : "aaa",
		    "streetNumber" : "40",
		    "streetName" : "rue saint sabin",
		    "zipcode" : "75011",
		    "countryCode" : "fr",
		    "city" : "Paris",
		    "loc" : [ 
		        48.8580654, 
		        2.3695263
		    ],
		    "formattedAddress" : "40 Rue Saint-Sabin, 75011 Paris, France",
		    "administrators" : [ 
		        "cAqconthf92Yrnutf"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : ISODate("2015-04-24T07:45:04.593Z"),
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/sEJKLQfXWmffogyt4/avatar",
		        "name" : "sEJKLQfXWmffogyt4/avatar",
		        "focusX" : null,
		        "focusY" : null,
		        "w" : null,
		        "h" : null
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/sEJKLQfXWmffogyt4/cover",
		        "name" : "sEJKLQfXWmffogyt4/cover",
		        "focusX" : 0.3388625592417061,
		        "focusY" : -0.3177257525083612,
		        "w" : 1200,
		        "h" : 851
		    },
		    "about" : "                \n\n\n                         cfscefv vfvdfv fdvdfv"
		});
	};

	if (Projects.find().count() === 0) {
		// Insert some fake project data
	};
});