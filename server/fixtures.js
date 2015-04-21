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
				"countryCode": "FR",
				"zipcode": "75002",
				"bio" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
				"skills": [
					{
			            "title" : "Développement web"
			        }, 
			        {
			            "title" : "UX design"
			        }
			    ]
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
		        "countryCode" : "FR",
		        "zipcode" : "75008",
		        "bio" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
		        "skills" : [ 
		            {
		                "title" : "Découper des trucs"
		            }, 
		            {
		                "title" : "Design d'objet industriel"
		            }
		        ]
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
		        "w" : 160,
		        "h" : 160
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
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
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
		    },
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
		    }
		});
		Places.insert({
		    "_id" : "ZMLHc88hxncfC6bkk",
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
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/avatar",
		        "name" : "ZMLHc88hxncfC6bkj/avatar",
		        "focusX" : 0,
		        "focusY" : 0,
		        "w" : 160,
		        "h" : 160
		    }
		});
	};

	if (Projects.find().count() === 0) {
		// Insert some fake project data
	};
});