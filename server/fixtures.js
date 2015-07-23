/**
 * Set a default data set for developement purpose
 */
 Meteor.startup(function () {
 	// Create a test notif
 	/*Notifications.insert({
 		"createdAt" : Date("2014-09-30T23:59:40.081Z"),
		"type": "comment",
		"from": ""
		"msg": "Welcome on Mapker",
		"userId": "i4FxWHYGyQr3LyN4x",
		"read": false,
 	});*/

	/*if (Meteor.users.find().count() > 0) {
		Meteor.users.remove({});
	}

	if (Places.find().count() > 0) {
		Places.remove({});
	};*/

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
		            "loc" : {
		                "lat": 48.8718722,
		                "lon": 2.31764320000002
		            }
		        },
		        "avatar" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/avatar",
		            "name" : "i4FxWHYGyQr3LyN4x/avatar"
		        },
		        "cover" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/cover",
		            "name" : "i4FxWHYGyQr3LyN4x/cover"
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
		            "loc" : {
		                "lat": 48.8718722,
		                "lon": 2.31764320000002
		            }
		        },
		        "avatar" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/cAqconthf92Yrnutf/avatar",
		            "name" : "cAqconthf92Yrnutf/avatar"
		        },
		        "cover" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/cAqconthf92Yrnutf/cover",
		            "name" : "cAqconthf92Yrnutf/cover"
		        }
		    }
		});
		Meteor.users.insert({
		    "_id" : "qwghbQDKgEKbBBFoN",
		    "createdAt" : Date("2015-05-04T14:08:01.886Z"),
		    "services" : {
		        "password" : {
		            "bcrypt" : "$2a$10$KiS3XbkoF6aYDMLlmQyhu.ujYWNEEwh0No70un1/U6zunsOgkTKj6"
		        },
		        "resume" : {
		            "loginTokens" : []
		        }
		    },
		    "emails" : [
		        {
		            "address" : "mario.simon@free.fr",
		            "verified" : false
		        }
		    ],
		    "profile" : {
		        "fullname" : "Mario Simon",
		        "firstname" : "Mario",
		        "lastname" : "Simon",
		        "activity" : "Photographer",
		        "address" : {
		            "countryCode" : "FR",
		            "zipcode" : "75010",
		            "city" : "Paris",
		            "loc" : {
		                "lat" : 48.8785618,
		                "lon" : 2.360368900000026
		            }
		        },
		        "cover" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/qwghbQDKgEKbBBFoN/cover",
		            "name" : "qwghbQDKgEKbBBFoN/cover"
		        },
		        "avatar" : {
		            "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/qwghbQDKgEKbBBFoN/avatar",
		            "name" : "qwghbQDKgEKbBBFoN/avatar"
		        },
		        "links" : {
		            "facebook" : "https://www.facebook.com/mariosimonphotographe",
		            "flickr" : "",
		            "twitter" : "",
		            "website" : "http://www.mariosimonpictures.tumblr.com"
		        },
		        "skills" : [
		            {
		                "title" : "Portraits"
		            },
		            {
		                "title" : "Photoshop"
		            },
		            {
		                "title" : "Studio"
		            },
		            {
		                "title" : "natural light"
		            },
		            {
		                "title" : "life"
		            },
		            {
		                "title" : "fashion"
		            },
		            {
		                "title" : "objects"
		            }
		        ],
		        "bio" : "I'm a parisian photographer"
		    }
		});
	}

	if (Labs.find().count() === 0) {
		// Insert some fake lab data
	}

	/**if (Machines.find().count() === 0) {
		// Insert some fake machine data
	};**/

	/*if (Places.find().count() === 0) {
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
		    "loc" : {
		        "lat": 48.8884512,
		        "lon": 2.312168
		    } ,
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
		        "name" : "ZMLHc88hxncfC6bkj/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkj/cover",
		        "name" : "ZMLHc88hxncfC6bkj/cover"
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
		    "loc" : {
		        "lat": 48.8184512,
		        "lon": 2.332168
		    } ,
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
		    "loc" : {
		        "lat": 48.8484512,
		        "lon": 2.392168
		    },
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
		        "name" : "ZMLHc88hxncfC6bkb/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkb/cover",
		        "name" : "ZMLHc88hxncfC6bkb/cover"
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
		    "loc" : {
		        "lat": 48.8384512,
		        "lon": 2.282168
		    },
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
		        "name" : "ZMLHc88hxncfC6bkc/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkc/cover",
		        "name" : "ZMLHc88hxncfC6bkc/cover"
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
		    "loc" : {
		        "lat": 48.8584512,
		        "lon": 2.322168
		    },
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
		        "name" : "ZMLHc88hxncfC6bkd/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkd/cover",
		        "name" : "ZMLHc88hxncfC6bkd/cover"
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
		    "loc" : {
		        "lat": 48.8324512,
		        "lon": 2.341168
		    },
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
		    "loc" : {
		        "lat": 48.8434512,
		        "lon": 2.322168
		    },
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
		    "loc" : {
		        "lat": 48.8584512,
		        "lon": 2.343168
		    },
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
		        "name" : "ZMLHc88hxncfC6bkg/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkg/cover",
		        "name" : "ZMLHc88hxncfC6bkg/cover"
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
		    "loc" : {
		        "lat": 48.8534512,
		        "lon": 2.372168
		    },
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
		    "loc" : {
		        "lat": 48.8784512,
		        "lon": 2.331168
		    },
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
		    "loc" : {
		        "lat": 48.8684512,
		        "lon": 2.352168
		    },
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
		        "name" : "ZMLHc88hxncfC6bkz/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/ZMLHc88hxncfC6bkk/cover",
		        "name" : "ZMLHc88hxncfC6bkk/cover"
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
		    "loc" : {
		        "lat": 48.8580654,
		        "lon": 2.3695263
		    },
		    "formattedAddress" : "40 Rue Saint-Sabin, 75011 Paris, France",
		    "administrators" : [
		        "cAqconthf92Yrnutf"
		    ],
		    "activated" : false,
		    "submittedBy" : "cAqconthf92Yrnutf",
		    "submittedAt" : Date("2015-04-24T07:45:04.593Z"),
		    "avatar" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/sEJKLQfXWmffogyt4/avatar",
		        "name" : "sEJKLQfXWmffogyt4/avatar"
		    },
		    "cover" : {
		        "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/sEJKLQfXWmffogyt4/cover",
		        "name" : "sEJKLQfXWmffogyt4/cover"
		    },
		    "about" : "                \n\n\n                         cfscefv vfvdfv fdvdfv"
		});
	};*/

	if (Projects.find().count() === 0) {
		// Insert some fake project data
	}
});
